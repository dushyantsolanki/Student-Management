import { useEffect, useState } from "react";
import SubjectFormModel from "../component/form/SubjectFormModel";
import { toast } from "react-toastify";
import axios from "axios";

const Subject = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const handleAddSubject = async (subjectData, resetForm, onClose) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/subject`,
        subjectData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      getAllSubjects();
      resetForm();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message || "Failed to add subject"
      );
    } finally {
      setLoading(false);
    }
  };

  const getAllSubjects = async () => {
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
      toast.error(
        error.response?.data?.error?.message || "Failed to fetch subjects"
      );
    }
  };

  useEffect(() => {
    getAllSubjects();
  }, []);

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        + New Subject
      </button>

      <div className="px-4 mt-4 flex flex-col gap-6">
        {Object.keys(subjects).length > 0 ? (
          Object.entries(subjects).map(([className, subs]) => (
            <div key={className}>
              <h2 className="text-lg font-semibold mb-2">{className}</h2>
              <div className="flex flex-wrap gap-4">
                {subs.map((sub) => (
                  <div
                    key={sub._id}
                    className="px-8 py-4 bg-gray-100 uppercase rounded-md"
                  >
                    {sub.name}
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
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSubject}
        loading={loading}
      />
    </div>
  );
};

export default Subject;
