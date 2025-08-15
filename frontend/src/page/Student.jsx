import { useEffect, useState } from "react";
import Table from "../component/Table";
import StudentFormModal from "../component/form/StudentFormModel";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader } from "../component/Loader";

const Student = () => {
  const colsHeader = [
    "firstName",
    "lastName",
    "class",
    "rollNo",
    "status",
    "actions",
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleAddStudent = async (studentData, resetForm, onClose) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/student`,
        studentData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      getAllStudents();
      toast.success("Student created successfully");
      resetForm();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = async (studentData, resetForm, onClose) => {
    setLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/student/${editingStudent?._id}`,
        studentData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      getAllStudents();
      toast.success("Student updated successfully");
      resetForm();
      onClose();
      setEditingStudent(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/student/${studentId}`
      );
      getAllStudents();
      toast.success("Student deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

  const getAllStudents = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/student`
      );
      setStudents(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch students");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const renderActions = (student) => (
    <div className="flex space-x-2">
      <button
        onClick={() => handleEditClick(student)}
        className="px-2 py-1  border rounded-md text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
      >
        Edit
      </button>
      <button
        onClick={() => handleDeleteStudent(student._id)}
        className="px-2 py-1 border rounded-md text-sm text-red-600 hover:text-red-800 cursor-pointer"
      >
        Delete
      </button>
    </div>
  );

  const formattedStudents = students.map((student) => ({
    ...student,
    actions: renderActions(student),
  }));

  return (
    <div className="">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        + New Student
      </button>

      <div className="mt-4">
        {isFetching ? (
          <Loader />
        ) : (
          <Table
            colsHeader={colsHeader}
            data={formattedStudents}
            currentPage={page}
            onPageChange={setPage}
            itemsPerPage={perPage}
            onItemsPerPageChange={setPerPage}
          />
        )}
      </div>

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
        loading={loading}
        initialData={editingStudent}
      />
    </div>
  );
};

export default Student;
