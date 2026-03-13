import express from "express";
import cors from "cors";
import { searchJobs } from "./controllers/searchController.js";
import { registerUser } from "./controllers/userController.js";
import Database from "./db/connection.js";

const app = express();
const PORT = 8000;

const db = new Database(process.env.MONGODB_URI);

db.connect().catch((err) =>
  console.error("Error connecting to database:", err),
);

app.use(cors());
app.use(express.json());

// Routes
app.post("/api/register", registerUser);
app.get("/api/search", searchJobs);

process.on("SIGINT", async () => {
  try {
    await db.disconnect();

    app.listen(PORT, () => {
      console.log(`Express running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});