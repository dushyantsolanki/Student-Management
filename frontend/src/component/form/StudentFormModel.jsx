import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema
const studentValidationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  class: Yup.string().required("Class is required"),
  rollNo: Yup.number()
    .positive("Roll number must be positive")
    .integer("Roll number must be an integer")
    .required("Roll number is required"),
});

// Modal Component
const StudentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
}) => {
  const isEditing = !!initialData;

  const formik = useFormik({
    initialValues: {
      id: initialData?.id || "",
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      class: initialData?.class || "",
      rollNo: initialData?.rollNo || "",
    },
    validationSchema: studentValidationSchema,
    enableReinitialize: true, // Allows form to reinitialize when initialData changes
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit(values, resetForm, onClose);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

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
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Student" : "Add New Student"}
            </h3>
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
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.firstName && formik.errors.firstName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter first name"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.lastName && formik.errors.lastName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter last name"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.lastName}
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.class && formik.errors.class
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Class</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                  <option value="5th">5th</option>
                  <option value="6th">6th</option>
                  <option value="7th">7th</option>
                  <option value="8th">8th</option>
                  <option value="9th">9th</option>
                  <option value="10th">10th</option>
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                </select>
                {formik.touched.class && formik.errors.class && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.class}
                  </p>
                )}
              </div>

              {/* Roll Number */}
              <div>
                <label
                  htmlFor="rollNo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Roll Number *
                </label>
                <input
                  type="number"
                  id="rollNo"
                  name="rollNo"
                  value={formik.values.rollNo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.rollNo && formik.errors.rollNo
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter roll number"
                />
                {formik.touched.rollNo && formik.errors.rollNo && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.rollNo}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formik.isValid}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
                  ? "Update Student"
                  : "Add Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentFormModal;
