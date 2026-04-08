import Job from '../models/job.model.js';
import User from '../models/users.model.js';

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

        let jobs = await Job.find(query);

        // sorting logic
        if (filters.sort === 'salary_desc') {
            jobs.sort((a, b) => b.salary - a.salary);
        } else if (filters.sort === 'salary_asc') {
            jobs.sort((a, b) => a.salary - b.salary);
        } else if (filters.sort === 'newest') {
            jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (filters.sort === 'popular') {
            // sort by most bids
            jobs.sort((a, b) => (b.bids?.length || 0) - (a.bids?.length || 0));
        } else {
            // default: newest first if no sort specified
            jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

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

        const user = await User.findById(userId);
        const isAdmin = user && user.role === 'admin';

        if (comment.userId.toString() !== userId.toString() && !isAdmin) {
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
        
        const user = await User.findById(userId);
        const isAdmin = user && user.role === 'admin';

        if (job.postedBy.toString() !== userId && !isAdmin) {
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

        const user = await User.findById(userId);
        const isAdmin = user && user.role === 'admin';

        if (job.postedBy.toString() !== userId && !isAdmin) {
            throw new Error("Unauthorized to delete this job");
        }
        await Job.findByIdAndDelete(jobId);
        return { message: "Job deleted successfully" };
    } catch (error) {
        throw error;
    }
}

export async function addReply(jobId, commentId, replyData) {
    try {
        const job = await Job.findById(jobId);
        if (!job) throw new Error("Job not found.");
        
        const comment = job.comments.id(commentId);
        if (!comment) throw new Error("Comment not found.");

        comment.replies.push(replyData);
        await job.save();
        return job;
    } catch (error) {
        console.error("Error in jobService addReply:", error);
        throw new Error("Failed to add reply.");
    }
}

export async function deleteReply(jobId, commentId, replyId, userId) {
    try {
        const job = await Job.findById(jobId);
        if (!job) throw new Error("Job not found.");

        const comment = job.comments.id(commentId);
        if (!comment) throw new Error("Comment not found.");

        const reply = comment.replies.id(replyId);
        if (!reply) throw new Error("Reply not found.");

        const user = await User.findById(userId);
        const isAdmin = user && user.role === 'admin';

        if (reply.userId.toString() !== userId.toString() && !isAdmin) {
            throw new Error("Unauthorized to delete this reply.");
        }

        comment.replies.pull(replyId);
        await job.save();
        return job;
    } catch (error) {
        console.error("Error in jobService deleteReply:", error);
        throw error;
    }
}