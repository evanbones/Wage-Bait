const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;
const DATA_PATH = path.join(__dirname, 'data');

app.use(cors());
app.use(express.json());

app.post('/api/register', (req, res) => {
    const newUser = req.body;
    console.log("Hell yeah, got some stuff from React: ", newUser);
    const usersFile = path.join(DATA_PATH, 'users.json');

    fs.readFile(usersFile, 'utf8', (err, data) => {
        let users = [];
        if (!err && data) {
            users = JSON.parse(data);
        }

        users.push(newUser);
        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Error writing to file:", writeErr);
                return res.status(500).json({ message: "Failed to save data" });
            }

            console.log("User saved successfully!");
            res.status(200).json({
                message: "Got yer data and saved it.",
                receivedData: newUser
            });
        });
    });
});

app.get('/api/search', (req, res) => {
    const searchTerm = req.query.q;

    if(!searchTerm) {
        return res.json([]);
    }

    try {
        const fileData = fs.readFileSync(path.join(DATA_PATH, 'jobs.json'), 'utf8');
        const jobs = JSON.parse(fileData);
        
        const filteredJobs = jobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        res.status(200).json(filteredJobs);
    } catch (error) {
        console.error("Error searching data:", error);
        res.status(500).json({ message: "Search failed" });
    }
})

app.listen(PORT, () => {
    console.log(`Express running on http://localhost:${PORT}`);
});