import express from 'express';
import cors from 'cors';
import { searchJobs } from './controllers/searchController.js';
import { registerUser } from './controllers/userController.js';
import Database from './db/connection.js';

const app = express();
const PORT = 8000;

const db = new Database(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.connect().catch((err) =>
  console.error("Error connecting to database:", err)
);

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/register', registerUser);
app.get('/api/search', searchJobs);

app.listen(PORT, () => {
    console.log(`Express running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  try {
    await db.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});