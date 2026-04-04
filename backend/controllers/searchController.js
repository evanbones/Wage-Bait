import * as jobService from '../services/jobService.js';

export async function searchJobs(req, res) {
    const searchTerm = req.query.q;
    const categories = req.query.categories ? req.query.categories.split(',') : [];
    const minSalary = req.query.minSalary;
    
    try {
        const filteredJobs = await jobService.searchJobs(searchTerm, { categories, minSalary });
        res.status(200).json(filteredJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getJobById(req, res) {
    const { id } = req.params;
    try {
        const job = await jobService.getJobById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function submitBid(req, res) {
    const { jobId, userId, minimumSalary } = req.body;
    
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const updatedJob = await jobService.addBid(jobId, userId, minimumSalary);
        res.status(200).json({ message: "Bid submitted successfully", job: updatedJob });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function addComment(req, res) {
    const { id } = req.params;
    const { userId, username, profilePic, text } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const updatedJob = await jobService.addComment(id, { userId, username, profilePic, text });
        res.status(200).json({ message: "Comment added successfully", job: updatedJob });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createJob(req, res) {
    try {
        const savedJob = await jobService.createJob(req.body);
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function updateJob(req, res) {
    try {
        const { userId, ...updateData } = req.body;
        const updatedJob = await jobService.updateJob(req.params.id, userId, updateData);
        res.status(200).json(updatedJob);
    } catch (error) {
        const status = error.message.includes("Unauthorized") ? 403 : 
                       error.message.includes("not found") ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
}

export async function deleteJob(req, res) {
    try {
        const { userId } = req.body;
        const result = await jobService.deleteJob(req.params.id, userId);
        res.status(200).json(result);
    } catch (error) {
        const status = error.message.includes("Unauthorized") ? 403 : 
                       error.message.includes("not found") ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
}
