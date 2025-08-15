import { useEffect, useState } from "react";
import MarkFormModel from "../component/form/MarkFormModel";
import Table from "../component/Table";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader } from "../component/Loader";

const Mark = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleAddMark = async (markData, resetForm, onClose) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/mark`,
        markData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      await getAllMarks();
      toast.success(response.data?.message || "Mark added successfully");
      resetForm();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add mark");
    } finally {
      setLoading(false);
    }
  };

  const getAllStudents = async (query = {}) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/student`,
        { params: query }
      );
      setStudents(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch students");
    }
  };

  const getAllSubjects = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/subject`
      );
      setSubjects(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch subjects");
    }
  };

  const getAllMarks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/mark`
      );
      setMarks(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch marks");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        await Promise.all([
          getAllMarks(),
          getAllStudents({ status: "pending" }),
          getAllSubjects(),
        ]);
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  const transformMarksData = () => {
    // Step 1: Organize marks by class
    const classData = {};

    // Loop through each mark entry
    marks.forEach((mark) => {
      const className = mark.studentClass;

      // Initialize class if not already present
      if (!classData[className]) {
        classData[className] = {
          students: {}, // To store student details
          subjects: new Set(), // To track unique subjects for the class
        };
      }

      // Add subject to the class's subject list
      classData[className].subjects.add(mark.subjectName);

      // Create a unique key for each student using name, class, and roll number
      const studentKey = `${mark.studentName}-${mark.studentClass}-${mark.rollNo}`;

      // Initialize student if not already present
      if (!classData[className].students[studentKey]) {
        classData[className].students[studentKey] = {
          studentName: mark.studentName,
          studentClass: mark.studentClass,
          rollNo: mark.rollNo,
          marks: {}, // To store marks for each subject
        };
      }

      // Store the mark for the subject
      classData[className].students[studentKey].marks[mark.subjectName] =
        mark.mark;
    });

    // Step 2: Prepare the final output
    const groupedByClass = {};

    // Loop through each class
    Object.keys(classData).forEach((className) => {
      const classInfo = classData[className];
      const allSubjects = Array.from(classInfo.subjects); // Convert subjects Set to array

      // Create data for each student in the class
      const studentData = Object.values(classInfo.students).map((student) => {
        // Start with basic student info
        const studentRow = {
          studentName: student.studentName,
          studentClass: student.studentClass,
          rollNo: student.rollNo,
        };

        // Add marks for each subject (use "-" if no mark exists)
        allSubjects.forEach((subject) => {
          studentRow[subject] =
            student.marks[subject] !== undefined ? student.marks[subject] : "-";
        });

        // Calculate average mark
        const validMarks = Object.values(student.marks).filter(
          (mark) => typeof mark === "number" && !isNaN(mark)
        );
        const average =
          validMarks.length > 0
            ? (
                validMarks.reduce((sum, mark) => sum + mark, 0) /
                validMarks.length
              ).toFixed(2)
            : "-";
        studentRow.average = average;

        return studentRow;
      });

      // Store the class data with students and subjects
      groupedByClass[className] = {
        data: studentData,
        subjects: allSubjects,
      };
    });

    return groupedByClass;
  };

  const groupedByClass = transformMarksData();

  return (
    <div className="p-4">
      <button
        onClick={() => setIsMarkModalOpen(true)}
        className="px-4 py-2 mb-4 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        + New Mark
      </button>

      <MarkFormModel
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        onSubmit={handleAddMark}
        loading={loading}
        students={students}
        subjects={subjects}
      />

      {isFetching ? (
        <Loader />
      ) : Object.keys(groupedByClass).length > 0 ? (
        Object.keys(groupedByClass).map((className) => (
          <div key={className} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Class: {className}</h2>
            <Table
              colsHeader={[
                "studentName",
                "rollNo",
                ...groupedByClass[className].subjects,
                "average",
              ]}
              data={groupedByClass[className].data}
            />
          </div>
        ))
      ) : (
        <div className="w-full text-center">No Data Available</div>
      )}
    </div>
  );
};

export default Mark;
