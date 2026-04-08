import * as analyticsService from '../services/analyticsService.js';
import User from '../models/users.model.js';

export async function getMarketInsights(req, res) {
    const { adminId } = req.query;
    
    try {
        // verify admin
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const insights = await analyticsService.getMarketInsights();
        res.status(200).json(insights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
