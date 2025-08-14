import express from "express";
import {
  createStudent,
  getStudents,
} from "../controller/student.controller.js";

const router = express.Router();

router.get("/", getStudents);

router.post("/", createStudent);

export default router;
