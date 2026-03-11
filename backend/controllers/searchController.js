import * as jobService from '../services/jobService.js';

export function searchJobs(req, res) {
    const searchTerm = req.query.q;
    
    try {
        const filteredJobs = jobService.searchJobs(searchTerm);
        res.status(200).json(filteredJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
