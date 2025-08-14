import { useEffect, useState } from "react";
import Table from "../component/Table";
import StudentFormModal from "../component/form/StudentFormModel";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader } from "../component/Loader";

const Student = () => {
  const colsHeader = ["firstName", "lastName", "class", "rollNo", "status"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

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
      toast.error(
        error.response?.data?.error?.message || "Failed to create student"
      );
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
      toast.error(
        error.response?.data?.error?.message || "Failed to fetch students"
      );
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  return (
    <div className="">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        + New Student
      </button>

      <div className="mt-4">
        {isFetching ? (
          <Loader />
        ) : (
          <Table
            colsHeader={colsHeader}
            data={students}
            currentPage={page}
            onPageChange={setPage}
            itemsPerPage={perPage}
            onItemsPerPageChange={setPerPage}
          />
        )}
      </div>

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStudent}
        loading={loading}
      />
    </div>
  );
};

export default Student;
