import mongoose from "mongoose";

const markSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },

    subjectId: {
      type: mongoose.Types.ObjectId,
      ref: "Subject",
    },

    mark: { type: Number, require: true, trim: true },
  },
  { timestamps: true }
);

const Mark = new mongoose.model("Mark", markSchema);

export default Mark;
