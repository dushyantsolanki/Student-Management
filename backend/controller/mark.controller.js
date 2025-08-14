import Mark from "../model/mark.model.js";
import Student from "../model/student.model.js";

export const createMarks = async (req, res) => {
  try {
    const { studentId, class: studentClass, marks } = req.body;

    if (!studentId || !marks || !Array.isArray(marks)) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const markDocs = marks.map((m) => ({
      studentId,
      subjectId: m.subjectId,
      mark: m.mark,
    }));

    await Mark.insertMany(markDocs);
    await Student.findByIdAndUpdate(studentId, { status: "done" });

    res.status(201).json({
      status: "success",
      message: "Marks saved successfully",
    });
  } catch (error) {
    console.error("Error saving marks:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal Server error",
    });
  }
};

export const getMarks = async (req, res) => {
  try {
    const marks = await Mark.find()
      .populate("studentId", "firstName lastName class rollNo")
      .populate("subjectId", "name class")
      .sort({ createdAt: -1 });

    // Transform data for table friendly formate
    const tableData = marks.map((m) => ({
      id: m._id,
      studentName: `${m.studentId.firstName} ${m.studentId.lastName}`,
      studentClass: m.studentId.class,
      subjectName: m.subjectId.name,
      rollNo: m.studentId.rollNo,
      mark: m.mark,
      createdAt: m.createdAt,
    }));

    res.status(200).json({
      status: "success",
      data: tableData,
    });
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal Server error",
    });
  }
};
