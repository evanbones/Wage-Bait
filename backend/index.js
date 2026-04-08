import express from "express";
import cors from "cors";
import { searchJobs, getJobById, submitBid, addComment, deleteComment, createJob, updateJob, deleteJob } from "./controllers/searchController.js";
import { registerUser, getProfile, updateProfile, getUserApplications, getUserPostings } from "./controllers/userController.js";
import * as adminController from "./controllers/adminController.js";
import * as analyticsController from "./controllers/analyticsController.js";
import { loginUser } from "./controllers/loginController.js";
import Database from "./db/connection.js";

const app = express();
const PORT = 8000;

const db = new Database(process.env.MONGODB_URI);

db.connect().catch((err) =>
  console.error("Error connecting to database:", err),
);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.post("/api/register", registerUser);
app.get("/api/search", searchJobs);
app.get("/api/jobs/:id", getJobById);
app.post("/api/jobs/bid", submitBid);
app.post("/api/jobs/:id/comments", addComment);
app.delete("/api/jobs/:id/comments/:commentId", deleteComment);
app.post("/api/login", loginUser);

// profile routes
app.get("/api/users/:id", getProfile);
app.put("/api/users/:id", updateProfile);

// get jobs applied to by user
app.get("/api/users/:id/applications", getUserApplications);

// get postings by user
app.get("/api/users/:id/postings", getUserPostings);

// job Creation route
app.post("/api/jobs", createJob);

// admin routes (more to be added)
app.get("/api/admin/users", adminController.getAllUsers);
app.put("/api/admin/users/status", adminController.toggleUserStatus);
app.get("/api/admin/insights", analyticsController.getMarketInsights);

// delete a job
app.delete("/api/jobs/:id", deleteJob);

// update a job
app.put("/api/jobs/:id", updateJob);

app.listen(PORT, () => {
  console.log(`Express running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  try {
    await db.disconnect();
    console.log("Database disconnected. Exiting process.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});