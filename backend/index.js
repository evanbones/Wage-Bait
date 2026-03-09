const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.post('/api/submit', (req, res) => {
    const formData = req.body;

    console.log("Hell yeah, got some stuff from React: ", formData);

    res.status(200).json({
        message: "Got yer data",
        recievedData: formData
    });
});

app.get('/api/get', (req, res) => {
    const formData = req.body;

    console.log("Hell yeah, got some stuff from React: ", formData);

    res.status(200).json({
        message: "Got yer data",
        recievedData: formData
    });
});

app.get('/api/search', (req, res) => {
    const searchTerm = req.query.q;

    if(!searchTerm) {
        return res.json([]);
    }

    res.json(searchTerm);
})

app.listen(PORT, () => {
    console.log(`Express running on http://localhost:${PORT}`);
});