import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, lowercase: true },
    class: { type: String, required: true, trim: true, lowercase: true },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

subjectSchema.index(
  { class: 1, name: 1 },
  { unique: true, partialFilterExpression: { isDelete: false } }
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
