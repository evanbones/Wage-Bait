import * as userService from '../services/userService.js';
import { sanitizeInput, isValidImageType, isValidUsername } from '../utils/security.js';

export async function registerUser(req, res) {
    const { username, email, password, profilePic } = req.body;

    // validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
    }

    if (!isValidUsername(username)) {
        return res.status(400).json({ message: "Username contains illegal characters" });
    }

    if (profilePic && !isValidImageType(profilePic)) {
        return res.status(400).json({ message: "Invalid image format. Please use JPG, PNG, or WEBP" });
    }

    const newUser = {
        username: sanitizeInput(username),
        email: sanitizeInput(email),
        password, // hashing is handled in the model hook
        profilePic
    };

    try {
        const savedUser = await userService.saveUser(newUser);
        res.status(201).json({
            message: "Got yer data and saved it.",
            receivedData: savedUser
        });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Failed to save data" });
    }
}

export async function getProfile(req, res) {
    const { id } = req.params;
    try {
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getProfileByUsername(req, res) {
    const { username } = req.params;
    try {
        const user = await userService.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function updateProfile(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedUser = await userService.updateUserProfile(id, updateData);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getUserApplications(req, res) {
    try {
        const formattedJobs = await userService.getUserApplications(req.params.id);
        res.status(200).json(formattedJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getUserPostings(req, res) {
    try {
        const jobs = await userService.getUserPostings(req.params.id);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}