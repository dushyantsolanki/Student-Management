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
      toast.error(error.response?.data?.error?.message || "Failed to add mark");
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
      toast.error(
        error.response?.data?.error?.message || "Failed to fetch students"
      );
    }
  };

  const getAllSubjects = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/subject`
      );
      setSubjects(response.data?.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message || "Failed to fetch subjects"
      );
    }
  };

  const getAllMarks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/mark`
      );
      setMarks(response.data?.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message || "Failed to fetch marks"
      );
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

  // Transform marks data and determine relevant subjects per class
  const transformMarksData = () => {
    // Group marks by class and track subjects per class
    const classData = marks.reduce((acc, mark) => {
      const classKey = mark.studentClass;
      if (!acc[classKey]) {
        acc[classKey] = {
          students: {},
          subjects: new Set(),
        };
      }
      acc[classKey].subjects.add(mark.subjectName);

      // Use rollNo in studentKey to differentiate students with same name
      const studentKey = `${mark.studentName}-${mark.studentClass}-${mark.rollNo}`;
      if (!acc[classKey].students[studentKey]) {
        acc[classKey].students[studentKey] = {
          studentName: mark.studentName,
          studentClass: mark.studentClass,
          rollNo: mark.rollNo,
          marks: {},
        };
      }
      acc[classKey].students[studentKey].marks[mark.subjectName] = mark.mark;
      return acc;
    }, {});

    // Transform data for each class
    const groupedByClass = {};
    Object.keys(classData).forEach((className) => {
      const classInfo = classData[className];
      groupedByClass[className] = {
        data: Object.values(classInfo.students).map((student) => {
          const row = {
            studentName: student.studentName,
            studentClass: student.studentClass,
            rollNo: student.rollNo,
          };

          // Include marks for subjects in this class
          classInfo.subjects.forEach((subject) => {
            row[subject] = student.marks[subject] || "-";
          });

          // Calculate average mark
          const marks = Object.values(student.marks).filter(
            (mark) => typeof mark === "number"
          );
          const average =
            marks.length > 0
              ? (
                  marks.reduce((sum, mark) => sum + mark, 0) / marks.length
                ).toFixed(2)
              : "-";
          row.average = average;

          return row;
        }),
        subjects: Array.from(classInfo.subjects),
      };
    });

    return groupedByClass;
  };

  const groupedByClass = transformMarksData();

  return (
    <div className="p-4">
      <button
        onClick={() => setIsMarkModalOpen(true)}
        className="px-4 py-2 mb-4 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
