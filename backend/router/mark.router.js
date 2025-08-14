import express from "express";
import { createMarks, getMarks } from "../controller/mark.controller.js";

const router = express.Router();

router.get("/", getMarks);
router.post("/", createMarks);

export default router;
