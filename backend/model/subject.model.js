import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, lowercase: true },
    class: { type: String, required: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);

subjectSchema.index({ class: 1, name: 1 }, { unique: true });

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
