import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../data');

export function searchJobs(searchTerm) {
    if (!searchTerm) return [];

    try {
        const fileData = fs.readFileSync(path.join(DATA_PATH, 'jobs.json'), 'utf8');
        const jobs = JSON.parse(fileData);
        
        return jobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
    } catch (error) {
        console.error("Error in jobService:", error);
        throw new Error("Failed to read jobs data.");
    }
}
