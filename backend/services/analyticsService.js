import Job from '../models/job.model.js';
import User from '../models/users.model.js';

export async function getMarketInsights() {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // parallel aggregations
    const [overallStats, categoryStats, timeSeriesStats, newUsersCount] = await Promise.all([
        // overall stats
        Job.aggregate([
            {
                $facet: {
                    totals: [
                        {
                            $group: {
                                _id: null,
                                totalJobs: { $sum: 1 },
                                avgOfferedSalary: { $avg: "$salary" },
                                remoteJobs: { $sum: { $cond: ["$remote", 1, 0] } },
                                totalBids: { $sum: { $size: "$bids" } },
                                newJobsToday: {
                                    $sum: { $cond: [{ $gte: ["$createdAt", todayStart] }, 1, 0] }
                                }
                            }
                        }
                    ],
                    bidStats: [
                        { $unwind: "$bids" },
                        {
                            $group: {
                                _id: null,
                                avgRequestedSalary: { $avg: "$bids.minimumSalary" },
                                totalBidsCount: { $sum: 1 },
                                newApplicationsToday: {
                                    $sum: { $cond: [{ $gte: ["$bids.createdAt", todayStart] }, 1, 0] }
                                }
                            }
                        }
                    ],
                    commentStats: [
                        { $unwind: "$comments" },
                        {
                            $group: {
                                _id: null,
                                newCommentsToday: {
                                    $sum: { $cond: [{ $gte: ["$comments.createdAt", todayStart] }, 1, 0] }
                                }
                            }
                        }
                    ]
                }
            }
        ]),

        // category breakdown
        Job.aggregate([
            {
                $group: {
                    _id: "$category",
                    avgSalary: { $avg: "$salary" },
                    bidCount: { $sum: { $size: "$bids" } }
                }
            },
            {
                $project: {
                    name: "$_id",
                    avgSalary: 1,
                    bidCount: 1,
                    _id: 0
                }
            }
        ]),

        // time series data (last 7 days)
        Job.aggregate([
            {
                $facet: {
                    offeredByDay: [
                        { $match: { createdAt: { $gte: sevenDaysAgo } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                totalSalary: { $sum: "$salary" },
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    requestedByDay: [
                        { $unwind: "$bids" },
                        { $match: { "bids.createdAt": { $gte: sevenDaysAgo } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$bids.createdAt" } },
                                totalRequested: { $sum: "$bids.minimumSalary" },
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]),

        // new users count
        User.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);

    const overall = overallStats[0].totals[0] || {};
    const bidStats = overallStats[0].bidStats[0] || {};
    const commentStats = overallStats[0].commentStats[0] || {};

    const avgOfferedSalary = overall.avgOfferedSalary || 0;
    const avgRequestedSalary = bidStats.avgRequestedSalary || 0;

    // format time series
    const timeSeries = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const dateStr = d.toISOString().split('T')[0];
        const displayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const offeredDay = timeSeriesStats[0].offeredByDay.find(item => item._id === dateStr);
        const requestedDay = timeSeriesStats[0].requestedByDay.find(item => item._id === dateStr);

        timeSeries.push({
            name: displayStr,
            avgOffered: offeredDay && offeredDay.count > 0 ? offeredDay.totalSalary / offeredDay.count : avgOfferedSalary,
            avgRequested: requestedDay && requestedDay.count > 0 ? requestedDay.totalRequested / requestedDay.count : avgRequestedSalary
        });
    }

    return {
        overall: {
            avgOfferedSalary,
            avgRequestedSalary,
            salaryGap: avgOfferedSalary - avgRequestedSalary,
            bidDensity: overall.totalJobs > 0 ? (overall.totalBids / overall.totalJobs) : 0,
            remoteRatio: overall.totalJobs > 0 ? (overall.remoteJobs / overall.totalJobs) * 100 : 0,
            totalBids: overall.totalBids || 0,
            totalJobs: overall.totalJobs || 0,
            newUsersThisWeek: newUsersCount,
            newJobsToday: overall.newJobsToday || 0,
            newApplicationsToday: bidStats.newApplicationsToday || 0,
            newCommentsToday: commentStats.newCommentsToday || 0
        },
        categories: categoryStats,
        timeSeries
    };
}

