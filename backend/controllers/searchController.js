import * as jobService from '../services/jobService.js';
import { sanitizeInput } from '../utils/security.js';

export async function searchJobs(req, res) {
    const searchTerm = sanitizeInput(req.query.q);
    const categories = req.query.categories ? req.query.categories.split(',') : [];
    const minSalary = req.query.minSalary;
    const sort = req.query.sort;
    
    try {
        const filteredJobs = await jobService.searchJobs(searchTerm, { categories, minSalary, sort });
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
    let { userId, username, profilePic, text } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const sanitizedComment = {
            userId,
            username: sanitizeInput(username),
            profilePic,
            text: sanitizeInput(text)
        };
        const updatedJob = await jobService.addComment(id, sanitizedComment);
        res.status(200).json({ message: "Comment added successfully", job: updatedJob });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteComment(req, res) {
    const { id, commentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const updatedJob = await jobService.deleteComment(id, commentId, userId);
        res.status(200).json({ message: "Comment deleted successfully", job: updatedJob });
    } catch (error) {
        const status = error.message.includes("Unauthorized") ? 403 : 
                       error.message.includes("not found") ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
}

export async function createJob(req, res) {
    try {
        const jobData = {
            ...req.body,
            title: sanitizeInput(req.body.title),
            company: sanitizeInput(req.body.company),
            location: sanitizeInput(req.body.location),
            description: sanitizeInput(req.body.description),
            category: sanitizeInput(req.body.category)
        };
        const savedJob = await jobService.createJob(jobData);
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function updateJob(req, res) {
    try {
        const { userId, ...updateData } = req.body;
        
        if (updateData.title) updateData.title = sanitizeInput(updateData.title);
        if (updateData.description) updateData.description = sanitizeInput(updateData.description);
        
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

export async function addReply(req, res) {
    const { id, commentId } = req.params;
    const { userId, username, profilePic, text } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const sanitizedReply = {
            userId,
            username: sanitizeInput(username),
            profilePic,
            text: sanitizeInput(text)
        };
        const updatedJob = await jobService.addReply(id, commentId, sanitizedReply);
        res.status(200).json({ message: "Reply added successfully", job: updatedJob });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteReply(req, res) {
    const { id, commentId, replyId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const updatedJob = await jobService.deleteReply(id, commentId, replyId, userId);
        res.status(200).json({ message: "Reply deleted successfully", job: updatedJob });
    } catch (error) {
        const status = error.message.includes("Unauthorized") ? 403 : 
                       error.message.includes("not found") ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
}