import { z } from "zod";
import { Student } from "../model/index.js";

const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  class: z.string().min(1, "Class is required"),
  rollNo: z.number({ invalid_type_error: "Roll number must be a number" }),
});

export const createStudent = async (req, res) => {
  const result = studentSchema.safeParse(req.body);

  if (!result.success) {
    if (!result.error) {
      console.error("Unexpected Zod error :", result.error);
      return res.status(400).json({
        status: "fail",
        message: "Invalid request data",
      });
    }
  }
  try {
    const student = new Student(result.data);
    const savedStudent = await student.save();

    return res.status(201).json({
      status: "success",
      message: "Student created successfully!",
      data: savedStudent,
    });
  } catch (error) {
    console.log("ERROR : createStudent :: ", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Roll number must be unique within the same class",
      });
    }
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const students = await Student.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      data: students,
    });
  } catch (error) {
    console.error("ERROR : getStudents :: ", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};
