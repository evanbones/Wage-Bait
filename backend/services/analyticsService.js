import Job from '../models/job.model.js';
import User from '../models/users.model.js';

const TIME_RANGE_CONFIG = {
    last24h: {
        key: 'last24h',
        label: 'Last 24 Hours',
        windowMs: 24 * 60 * 60 * 1000,
        bucket: 'hour',
        pointCount: 24
    },
    last7d: {
        key: 'last7d',
        label: 'Last 7 Days',
        windowMs: 7 * 24 * 60 * 60 * 1000,
        bucket: 'day',
        pointCount: 7
    },
    last30d: {
        key: 'last30d',
        label: 'Last 30 Days',
        windowMs: 30 * 24 * 60 * 60 * 1000,
        bucket: 'day',
        pointCount: 30
    },
    all: {
        key: 'all',
        label: 'All Time',
        windowMs: null,
        bucket: 'month',
        pointCount: null
    }
};

function resolveRangeConfig(rangeKey) {
    return TIME_RANGE_CONFIG[rangeKey] || TIME_RANGE_CONFIG.last7d;
}

function buildRangeStartDate(rangeConfig, now) {
    if (!rangeConfig.windowMs) return null;
    return new Date(now.getTime() - rangeConfig.windowMs);
}

function buildDateBucketExpression(bucket, datePath) {
    if (bucket === 'hour') {
        return { $dateToString: { format: '%Y-%m-%dT%H', date: datePath, timezone: 'UTC' } };
    }

    if (bucket === 'day') {
        return { $dateToString: { format: '%Y-%m-%d', date: datePath, timezone: 'UTC' } };
    }

    return { $dateToString: { format: '%Y-%m', date: datePath, timezone: 'UTC' } };
}

function getBucketKey(date, bucket) {
    const iso = date.toISOString();

    if (bucket === 'hour') return iso.slice(0, 13);
    if (bucket === 'day') return iso.slice(0, 10);
    return iso.slice(0, 7);
}

function buildFilledBucketKeys(rangeConfig, now) {
    if (!rangeConfig.pointCount) return [];

    const keys = [];
    const anchor = new Date(now);

    if (rangeConfig.bucket === 'hour') {
        anchor.setUTCMinutes(0, 0, 0);

        for (let offset = rangeConfig.pointCount - 1; offset >= 0; offset -= 1) {
            const d = new Date(anchor);
            d.setUTCHours(d.getUTCHours() - offset);
            keys.push(getBucketKey(d, 'hour'));
        }

        return keys;
    }

    anchor.setUTCHours(0, 0, 0, 0);

    for (let offset = rangeConfig.pointCount - 1; offset >= 0; offset -= 1) {
        const d = new Date(anchor);
        d.setUTCDate(d.getUTCDate() - offset);
        keys.push(getBucketKey(d, 'day'));
    }

    return keys;
}

function getDateFromBucketKey(bucket, key) {
    if (bucket === 'hour') return new Date(`${key}:00:00.000Z`);
    if (bucket === 'day') return new Date(`${key}T00:00:00.000Z`);
    return new Date(`${key}-01T00:00:00.000Z`);
}

function formatBucketLabel(bucket, key) {
    const date = getDateFromBucketKey(bucket, key);

    if (bucket === 'hour') {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
            timeZone: 'UTC'
        });
    }

    if (bucket === 'day') {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC'
        });
    }

    return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC'
    });
}

function buildTimeSeries({
    offeredRows,
    requestedRows,
    rangeConfig,
    now,
    avgOfferedSalary,
    avgRequestedSalary
}) {
    const offeredMap = new Map((offeredRows || []).map(row => [row._id, row]));
    const requestedMap = new Map((requestedRows || []).map(row => [row._id, row]));

    const keys = rangeConfig.pointCount
        ? buildFilledBucketKeys(rangeConfig, now)
        : Array.from(new Set([...offeredMap.keys(), ...requestedMap.keys()])).sort();

    return keys.map((key) => {
        const offeredPoint = offeredMap.get(key);
        const requestedPoint = requestedMap.get(key);

        return {
            name: formatBucketLabel(rangeConfig.bucket, key),
            avgOffered: offeredPoint && offeredPoint.count > 0
                ? offeredPoint.totalSalary / offeredPoint.count
                : avgOfferedSalary,
            avgRequested: requestedPoint && requestedPoint.count > 0
                ? requestedPoint.totalRequested / requestedPoint.count
                : avgRequestedSalary
        };
    });
}

export async function getMarketInsights(range = 'last7d') {
    const now = new Date();
    const rangeConfig = resolveRangeConfig(range);
    const rangeStartDate = buildRangeStartDate(rangeConfig, now);
    const dateBucketExpr = buildDateBucketExpression(rangeConfig.bucket, '$createdAt');
    const bidDateBucketExpr = buildDateBucketExpression(rangeConfig.bucket, '$bids.createdAt');

    const jobRangeMatch = rangeStartDate ? [{ $match: { createdAt: { $gte: rangeStartDate } } }] : [];
    const bidRangeMatch = rangeStartDate ? [{ $match: { 'bids.createdAt': { $gte: rangeStartDate } } }] : [];
    const commentRangeMatch = rangeStartDate ? [{ $match: { 'comments.createdAt': { $gte: rangeStartDate } } }] : [];
    const userRangeFilter = rangeStartDate ? { createdAt: { $gte: rangeStartDate } } : {};

    const [overallStats, categoryStats, timeSeriesStats, usersInRangeCount] = await Promise.all([
        Job.aggregate([
            {
                $facet: {
                    totals: [
                        ...jobRangeMatch,
                        {
                            $group: {
                                _id: null,
                                totalJobs: { $sum: 1 },
                                avgOfferedSalary: { $avg: '$salary' },
                                remoteJobs: { $sum: { $cond: ['$remote', 1, 0] } }
                            }
                        }
                    ],
                    bidStats: [
                        { $unwind: '$bids' },
                        ...bidRangeMatch,
                        {
                            $group: {
                                _id: null,
                                avgRequestedSalary: { $avg: '$bids.minimumSalary' },
                                totalBidsCount: { $sum: 1 }
                            }
                        }
                    ],
                    commentStats: [
                        { $unwind: '$comments' },
                        ...commentRangeMatch,
                        {
                            $group: {
                                _id: null,
                                totalCommentsCount: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]),
        Job.aggregate([
            { $unwind: '$bids' },
            ...bidRangeMatch,
            {
                $group: {
                    _id: '$category',
                    avgSalary: { $avg: '$salary' },
                    bidCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: { $ifNull: ['$_id', 'Other'] },
                    avgSalary: 1,
                    bidCount: 1,
                    _id: 0
                }
            },
            { $sort: { bidCount: -1, name: 1 } }
        ]),
        Job.aggregate([
            {
                $facet: {
                    offeredByBucket: [
                        ...jobRangeMatch,
                        {
                            $group: {
                                _id: dateBucketExpr,
                                totalSalary: { $sum: '$salary' },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],
                    requestedByBucket: [
                        { $unwind: '$bids' },
                        ...bidRangeMatch,
                        {
                            $group: {
                                _id: bidDateBucketExpr,
                                totalRequested: { $sum: '$bids.minimumSalary' },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ]
                }
            }
        ]),
        User.countDocuments(userRangeFilter)
    ]);

    const overall = overallStats[0]?.totals?.[0] || {};
    const bidStats = overallStats[0]?.bidStats?.[0] || {};
    const commentStats = overallStats[0]?.commentStats?.[0] || {};

    const totalJobs = overall.totalJobs || 0;
    const totalBids = bidStats.totalBidsCount || 0;
    const totalComments = commentStats.totalCommentsCount || 0;
    const avgOfferedSalary = overall.avgOfferedSalary || 0;
    const avgRequestedSalary = bidStats.avgRequestedSalary || 0;

    const timeSeries = buildTimeSeries({
        offeredRows: timeSeriesStats[0]?.offeredByBucket || [],
        requestedRows: timeSeriesStats[0]?.requestedByBucket || [],
        rangeConfig,
        now,
        avgOfferedSalary,
        avgRequestedSalary
    });

    return {
        range: {
            key: rangeConfig.key,
            label: rangeConfig.label
        },
        overall: {
            avgOfferedSalary,
            avgRequestedSalary,
            salaryGap: avgOfferedSalary - avgRequestedSalary,
            bidDensity: totalJobs > 0 ? totalBids / totalJobs : 0,
            remoteRatio: totalJobs > 0 ? (overall.remoteJobs / totalJobs) * 100 : 0,
            totalBids,
            totalJobs,
            newUsersThisWeek: usersInRangeCount,
            newJobsToday: totalJobs,
            newApplicationsToday: totalBids,
            newCommentsToday: totalComments
        },
        categories: categoryStats,
        timeSeries
    };
}
