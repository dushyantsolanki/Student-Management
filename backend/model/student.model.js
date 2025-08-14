import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    class: { type: String, require: true },
    rollNo: { type: Number, require: true },
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    },
  },
  { timestamps: true }
);
studentSchema.index({ class: 1, rollNo: 1 }, { unique: true });

const Student = new mongoose.model("Student", studentSchema);

export default Student;
