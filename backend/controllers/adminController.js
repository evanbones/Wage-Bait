import * as adminService from '../services/adminService.js';

export async function getAllUsers(req, res) {
    const { q } = req.query;
    try {
        const users = await adminService.getAllUsers(q);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function toggleUserStatus(req, res) {
    const { userId, adminId } = req.body;
    console.log("AdminController toggleUserStatus - userId:", userId, "adminId:", adminId);
    try {
        const updatedUser = await adminService.toggleUserStatus(userId, adminId);
        console.log("Successfully toggled status for:", updatedUser.username);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("AdminController toggleUserStatus ERROR:", error.message);
        const status = error.message.includes("Unauthorized") ? 403 : 
                       error.message.includes("not found") ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
}
