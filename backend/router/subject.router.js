import express from "express";
import {
  createSubject,
  getSubjects,
} from "../controller/subject.controller.js";

const router = express.Router();

router.get("/", getSubjects);
router.post("/", createSubject);

export default router;
