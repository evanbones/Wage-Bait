import Job from '../models/job.model.js';

export async function searchJobs(searchTerm, filters = {}) {
    try {
        let query = {};
        
        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { company: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        if (filters.categories && filters.categories.length > 0) {
            query.category = { $in: filters.categories };
        }

        if (filters.minSalary) {
            query.salary = { $gte: Number(filters.minSalary) };
        }

        const jobs = await Job.find(query);
        return jobs;
    } catch (error) {
        console.error("Error in jobService searchJobs:", error);
        throw new Error("Failed to search jobs in database.");
    }
}

export async function getJobById(jobId) {
    try {
        const job = await Job.findById(jobId);
        return job;
    } catch (error) {
        console.error("Error in jobService getJobById:", error);
        throw new Error("Failed to fetch job details from database.");
    }
}

export async function addBid(jobId, userId, minimumSalary) {
    try {
        const job = await Job.findById(jobId);
        if (!job) throw new Error("Job not found.");

        // Check if user already bid
        const existingBidIndex = job.bids.findIndex(bid => bid.userId.toString() === userId.toString());
        
        if (existingBidIndex > -1) {
            job.bids[existingBidIndex].minimumSalary = minimumSalary;
            job.bids[existingBidIndex].createdAt = Date.now();
        } else {
            job.bids.push({ userId, minimumSalary });
        }

        await job.save();
        return job;
    } catch (error) {
        console.error("Error in jobService addBid:", error);
        throw new Error("Failed to add/update bid.");
    }
}

export async function addComment(jobId, commentData) {
    try {
        const job = await Job.findById(jobId);
        if (!job) throw new Error("Job not found.");

        job.comments.push(commentData);
        await job.save();
        return job;
    } catch (error) {
        console.error("Error in jobService addComment:", error);
        throw new Error("Failed to add comment.");
    }
}

export async function deleteComment(jobId, commentId, userId) {
    try {
        const job = await Job.findById(jobId);
        if (!job) throw new Error("Job not found.");

        const comment = job.comments.id(commentId);
        if (!comment) throw new Error("Comment not found.");

        if (comment.userId.toString() !== userId.toString()) {
            throw new Error("Unauthorized to delete this comment.");
        }

        job.comments.pull(commentId);
        await job.save();
        return job;
    } catch (error) {
        console.error("Error in jobService deleteComment:", error);
        throw error;
    }
}

export async function createJob(jobData) {
    try {
        const newJob = new Job(jobData);
        const savedJob = await newJob.save();
        return savedJob;
    } catch (error) {
        throw error;
    }
}

export async function updateJob(jobId, userId, updateData) {
    try {
        const job = await Job.findById(jobId);
        if (!job) throw new Error("Job not found");
        if (job.postedBy.toString() !== userId) {
            throw new Error("Unauthorized to update this job");
        }
        const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true });
        return updatedJob;
    } catch (error) {
        throw error;
    }
}

export async function deleteJob(jobId, userId) {
    try {
        const job = await Job.findById(jobId);
        if (!job) throw new Error("Job not found");
        if (job.postedBy.toString() !== userId) {
            throw new Error("Unauthorized to delete this job");
        }
        await Job.findByIdAndDelete(jobId);
        return { message: "Job deleted successfully" };
    } catch (error) {
        throw error;
    }
}
