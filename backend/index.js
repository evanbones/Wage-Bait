import express from 'express';
import cors from 'cors';
import { searchJobs } from './controllers/searchController.js';
import { registerUser } from './controllers/userController.js';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/register', registerUser);
app.get('/api/search', searchJobs);

app.listen(PORT, () => {
    console.log(`Express running on http://localhost:${PORT}`);
});
