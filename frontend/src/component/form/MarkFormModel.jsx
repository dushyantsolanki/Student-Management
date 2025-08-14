import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema
const markValidationSchema = Yup.object({
  studentId: Yup.string().required("Student is required"),
  class: Yup.string().required("Class is required"),
  marks: Yup.array()
    .of(
      Yup.object({
        subjectId: Yup.string().required("Subject is required"),
        mark: Yup.number()
          .typeError("Marks must be a number")
          .min(0, "Marks cannot be less than 0")
          .max(100, "Marks cannot be more than 100")
          .required("Marks are required"),
      })
    )
    .min(1, "At least one subject mark is required"),
});

const MarkFormModel = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  students = [],
  subjects = [],
}) => {
  const formik = useFormik({
    initialValues: {
      studentId: "",
      class: "",
      marks: [],
    },
    validationSchema: markValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const submissionData = {
          studentId: values.studentId,
          class: values.class,
          marks: values.marks.map(({ subjectId, mark }) => ({
            subjectId,
            mark: Number(mark), // Ensure mark is a number
          })),
        };
        await onSubmit(submissionData, resetForm, onClose);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    validateOnMount: true, // Validate on initial render to check form validity
  });

  // Get the selected student's class
  const selectedStudent = students.find(
    (student) => student._id === formik.values.studentId
  );
  const selectedClass = selectedStudent ? selectedStudent.class : "";

  // Filter subjects based on selected class
  const filteredSubjects = subjects.filter(
    (subject) => subject.class === formik.values.class
  );

  // Update marks array when class changes
  const handleClassChange = (e) => {
    const newClass = e.target.value;
    formik.setFieldValue("class", newClass);
    // Initialize marks array with all subjects for the selected class
    const newMarks = filteredSubjects.map((subject) => ({
      subjectId: subject._id,
      mark: "",
    }));
    formik.setFieldValue("marks", newMarks);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/10 bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add Marks</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Student */}
              <div>
                <label
                  htmlFor="studentId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Student *
                </label>
                <select
                  id="studentId"
                  name="studentId"
                  value={formik.values.studentId}
                  onChange={(e) => {
                    formik.handleChange(e);
                    // Reset class and marks when student changes
                    formik.setFieldValue("class", "");
                    formik.setFieldValue("marks", []);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.studentId && formik.errors.studentId
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName} ({student.class} -
                      Roll {student.rollNo})
                    </option>
                  ))}
                </select>
                {formik.touched.studentId && formik.errors.studentId && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.studentId}
                  </p>
                )}
              </div>

              {/* Class */}
              <div>
                <label
                  htmlFor="class"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Class *
                </label>
                <select
                  id="class"
                  name="class"
                  value={formik.values.class}
                  onChange={handleClassChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.class && formik.errors.class
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={!selectedStudent}
                >
                  <option value="">Select Class</option>
                  {selectedStudent && (
                    <option value={selectedClass}>{selectedClass}</option>
                  )}
                </select>
                {formik.touched.class && formik.errors.class && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.class}
                  </p>
                )}
              </div>

              {/* Marks for each subject */}
              {formik.values.class && filteredSubjects.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marks for Subjects *
                  </label>
                  {filteredSubjects.map((subject, index) => (
                    <div key={subject._id} className="mb-4">
                      <label
                        htmlFor={`marks[${index}].mark`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {subject.name} ({subject.class})
                      </label>
                      <input
                        type="number"
                        id={`marks[${index}].mark`}
                        name={`marks[${index}].mark`}
                        value={formik.values.marks[index]?.mark || ""}
                        onChange={(e) => {
                          formik.handleChange(e);
                          // Ensure subjectId is set for this mark
                          formik.setFieldValue(
                            `marks[${index}].subjectId`,
                            subject._id
                          );
                        }}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formik.touched.marks?.[index]?.mark &&
                          formik.errors.marks?.[index]?.mark
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder={`Enter marks for ${subject.name}`}
                      />
                      {formik.touched.marks?.[index]?.mark &&
                        formik.errors.marks?.[index]?.mark && (
                          <p className="mt-1 text-sm text-red-600">
                            {formik.errors.marks[index].mark}
                          </p>
                        )}
                    </div>
                  ))}
                </div>
              )}
              {formik.values.class && filteredSubjects.length === 0 && (
                <p className="text-sm text-red-600">
                  No subjects found for the selected class.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading || !formik.isValid || filteredSubjects.length === 0
                }
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add Marks"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarkFormModel;
