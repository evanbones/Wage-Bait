import * as userService from '../services/userService.js';

export async function registerUser(req, res) {
    const newUser = req.body;
    console.log("Hell yeah, got some stuff from React: ", newUser);

    try {
        const savedUser = await userService.saveUser(newUser);
        res.status(200).json({
            message: "Got yer data and saved it.",
            receivedData: savedUser
        });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Failed to save data" });
    }
}
