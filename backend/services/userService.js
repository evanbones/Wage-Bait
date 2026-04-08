import User from '../models/users.model.js';
import Job from '../models/job.model.js';

export async function saveUser(newUser) {
    try {
        const user = new User(newUser);
        const savedUser = await user.save();
        return savedUser;
    } catch (error) {
        throw error;
    }
}

export async function getUserById(userId) {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        throw error;
    }
}

export async function getUserByUsername(username) {
    try {
        // case-insensitive search for username
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        return user;
    } catch (error) {
        throw error;
    }
}

export async function updateUserProfile(userId, updateData) {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        // update fields individually to trigger hooks
        Object.keys(updateData).forEach(key => {
            user[key] = updateData[key];
        });

        const updatedUser = await user.save();
        return updatedUser;
    } catch (error) {
        throw error;
    }
}

export async function getUserApplications(userId) {
    try {
        const jobs = await Job.find({ "bids.userId": userId });
        // filter bids to only include the user's own bid for each job
        return jobs.map(job => {
            const userBid = job.bids.find(bid => bid.userId.toString() === userId);
            return {
                ...job.toObject(),
                myBid: userBid
            };
        });
    } catch (error) {
        throw error;
    }
}

export async function getUserPostings(userId) {
    try {
        const jobs = await Job.find({ postedBy: userId })
            .populate('bids.userId', 'username email skills experience education profilePic');
        return jobs;
    } catch (error) {
        throw error;
    }
}