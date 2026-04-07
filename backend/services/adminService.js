import User from '../models/users.model.js';

export async function getAllUsers(searchTerm) {
    try {
        let query = {};
        if (searchTerm) {
            query.$or = [
                { username: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        const users = await User.find(query, "username email role isActive profilePic skills");
        return users;
    } catch (error) {
        throw error;
    }
}

export async function toggleUserStatus(userId, adminId) {
    try {
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            throw new Error("Unauthorized: Only admins can perform this action.");
        }

        const user = await User.findById(userId);
        if (!user) throw new Error("User not found.");

        user.isActive = !user.isActive;
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
}
