import * as loginService from "../services/loginService.js";

export async function loginUser(req, res) {
    const { username, password } = req.body;
    try {
        const userInfo = await loginService.findUser(username);
        if (!userInfo) {
            console.error("User not found");
            return res.json({ message: "User not found" });
        } if (userInfo.password !== password) {
            console.error("Invalid password");
            return res.json({ message: "Invalid password" });
        }
        res.json({
            message: "Login successful",
            receivedData: userInfo
        })
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Failed to login" });
    }
}