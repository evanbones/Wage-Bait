import Job from '../models/job.model.js';
import User from '../models/users.model.js';

export async function getMarketInsights() {
    const jobs = await Job.find({});
    const users = await User.find({});
    
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // salary analysis
    const totalOfferedSalary = jobs.reduce((sum, job) => sum + job.salary, 0);
    const avgOfferedSalary = jobs.length > 0 ? totalOfferedSalary / jobs.length : 0;

    let totalRequestedSalary = 0;
    let totalBids = 0;
    let newApplicationsToday = 0;
    let newCommentsToday = 0;
    let newJobsToday = 0;

    jobs.forEach(job => {
        // New jobs today
        if (job.createdAt && new Date(job.createdAt) >= todayStart) {
            newJobsToday++;
        }

        // Bids stats
        job.bids.forEach(bid => {
            totalRequestedSalary += bid.minimumSalary;
            totalBids++;
            if (bid.createdAt && new Date(bid.createdAt) >= todayStart) {
                newApplicationsToday++;
            }
        });

        // comments stats
        job.comments.forEach(comment => {
            if (comment.createdAt && new Date(comment.createdAt) >= todayStart) {
                newCommentsToday++;
            }
        });
    });

    const avgRequestedSalary = totalBids > 0 ? totalRequestedSalary / totalBids : 0;

    // user stats
    const newUsersThisWeek = users.filter(u => u.createdAt && new Date(u.createdAt) >= sevenDaysAgo).length;

    // bid density
    const bidDensity = jobs.length > 0 ? totalBids / jobs.length : 0;

    // remote jobs ratio
    const remoteJobs = jobs.filter(j => j.remote).length;
    const remoteRatio = jobs.length > 0 ? (remoteJobs / jobs.length) * 100 : 0;

    // category breakdown
    const categoryStats = {};
    jobs.forEach(job => {
        if (!categoryStats[job.category]) {
            categoryStats[job.category] = { count: 0, totalSalary: 0, totalBids: 0 };
        }
        categoryStats[job.category].count++;
        categoryStats[job.category].totalSalary += job.salary;
        categoryStats[job.category].totalBids += job.bids.length;
    });

    const categories = Object.keys(categoryStats).map(cat => ({
        name: cat,
        avgSalary: categoryStats[cat].totalSalary / categoryStats[cat].count,
        bidCount: categoryStats[cat].totalBids
    }));

    // time series data (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        last7Days.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            timestamp: date.getTime(),
            offered: 0,
            requested: 0,
            offeredCount: 0,
            requestedCount: 0
        });
    }

    // populate offered salaries over time
    jobs.forEach(job => {
        if (job.createdAt) {
            const jobDate = new Date(job.createdAt);
            jobDate.setHours(0, 0, 0, 0);
            const day = last7Days.find(d => d.timestamp === jobDate.getTime());
            if (day) {
                day.offered += job.salary;
                day.offeredCount++;
            }
        }
        
        // populate requested salaries over time
        job.bids.forEach(bid => {
            if (bid.createdAt) {
                const bidDate = new Date(bid.createdAt);
                bidDate.setHours(0, 0, 0, 0);
                const day = last7Days.find(d => d.timestamp === bidDate.getTime());
                if (day) {
                    day.requested += bid.minimumSalary;
                    day.requestedCount++;
                }
            }
        });
    });

    const timeSeries = last7Days.map(day => ({
        name: day.date,
        avgOffered: day.offeredCount > 0 ? day.offered / day.offeredCount : avgOfferedSalary, 
        avgRequested: day.requestedCount > 0 ? day.requested / day.requestedCount : avgRequestedSalary
    }));

    return {
        overall: {
            avgOfferedSalary,
            avgRequestedSalary,
            salaryGap: avgOfferedSalary - avgRequestedSalary,
            bidDensity,
            remoteRatio,
            totalBids,
            totalJobs: jobs.length,
            newUsersThisWeek,
            newJobsToday,
            newApplicationsToday,
            newCommentsToday
        },
        categories,
        timeSeries
    };
}
