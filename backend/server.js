import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import studentRoutes from "./router/student.router.js";
import markRoutes from "./router/mark.router.js";
import subjectRoutes from "./router/subject.router.js";
import { connect } from "./db/db.connect.js";
import path from "path";
configDotenv();

const app = express();
const PORT = 3000;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/mark", markRoutes);
app.use("/api/v1/subject", subjectRoutes);

//  Frontend files serving via a backend
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});
app.listen(PORT, async (req, res) => {
  try {
    await connect();
    console.log(`SERVER listen at port : ${PORT}`);
  } catch (error) {
    console.log("ERROR in server.js :: ", error);
  }
});
