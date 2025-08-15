import { useEffect, useState } from "react";
import SubjectFormModel from "../component/form/SubjectFormModel";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader } from "../component/Loader";

const Subject = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);

  const handleAddSubject = async (subjectData, resetForm, onClose) => {
    setLoading(true);
    try {
      if (editingSubject) {
        // Update existing subject
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/subject/${
            editingSubject._id
          }`,
          subjectData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        toast.success("Subject updated successfully");
      } else {
        // Create new subject
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/subject`,
          subjectData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        toast.success("Subject added successfully");
      }

      getAllSubjects();
      resetForm();
      onClose();
      setEditingSubject(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${editingSubject ? "update" : "add"} subject`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      setLoading(true);
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/v1/subject/${subjectId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        toast.success("Subject deleted successfully");
        getAllSubjects();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete subject"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const getAllSubjects = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/subject`
      );

      setSubjects(
        response.data?.data?.reduce((acc, sub) => {
          if (!acc[sub.class]) {
            acc[sub.class] = [];
          }
          acc[sub.class].push(sub);
          return acc;
        }, {}) || {}
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch subjects");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getAllSubjects();
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          setEditingSubject(null);
          setIsModalOpen(true);
        }}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        + New Subject
      </button>

      <div className="px-4 mt-4 flex flex-col gap-6">
        {isFetching ? (
          <Loader />
        ) : Object.keys(subjects).length > 0 ? (
          Object.entries(subjects).map(([className, subs]) => (
            <div key={className}>
              <h2 className="text-lg font-semibold mb-2">{className}</h2>
              <div className="flex flex-wrap gap-4">
                {subs.map((sub) => (
                  <div
                    key={sub._id}
                    className="px-8 py-4 bg-gray-100 uppercase rounded-md flex items-center gap-2"
                  >
                    <span>{sub.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSubject(sub)}
                        className="px-2 py-1  border rounded-md text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(sub._id)}
                        className="px-2 py-1 border rounded-md text-sm text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center">No Data Available</div>
        )}
      </div>

      <SubjectFormModel
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubject(null);
        }}
        onSubmit={handleAddSubject}
        loading={loading}
        initialData={editingSubject}
      />
    </div>
  );
};

export default Subject;
