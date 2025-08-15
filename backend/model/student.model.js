import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, lowercase: true },
    lastName: { type: String, required: true, trim: true, lowercase: true },
    class: { type: String, required: true, trim: true, lowercase: true },
    rollNo: { type: Number, require: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

studentSchema.index(
  { class: 1, rollNo: 1 },
  { unique: true, partialFilterExpression: { isDelete: false } }
);
const Student = new mongoose.model("Student", studentSchema);

export default Student;
