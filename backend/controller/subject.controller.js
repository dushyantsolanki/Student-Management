import { z } from "zod";
import Subject from "../model/subject.model.js";

const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  class: z.string().min(1, "Class is required"),
});

export const createSubject = async (req, res) => {
  const result = subjectSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      status: "fail",
      message: result.error.errors.map((err) => err.message).join(", "),
    });
  }

  try {
    const subject = new Subject(result.data);
    const savedSubject = await subject.save();

    return res.status(201).json({
      status: "success",
      message: "Subject created successfully!",
      data: savedSubject,
    });
  } catch (error) {
    console.error("ERROR : createSubject ::", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Subject name must be unique",
      });
    }

    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      message: "All subject fetched successfully!",
      data: subjects,
    });
  } catch (error) {
    console.error("ERROR : getSubjects ::", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};
