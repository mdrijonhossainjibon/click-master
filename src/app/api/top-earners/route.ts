import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { TopEarner, ITopEarner } from '@/models/TopEarner';

type TimeFrame = 'today' | 'week' | 'month' | 'all';

interface Stats {
    totalEarnings: number;
    totalAds: number;
    avgEarnings: number;
}

type MongoTopEarner = ITopEarner & {
    _id: mongoose.Types.ObjectId;
    __v: number;
    createdAt: Date;
    updatedAt: Date;
};

function getTimeframeFilter(timeframe: TimeFrame) {
    const now = new Date();
    switch (timeframe) {
        case 'today':
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return { lastActive: { $gte: startOfDay } };
        case 'week':
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - 7);
            return { lastActive: { $gte: startOfWeek } };
        case 'month':
            const startOfMonth = new Date(now);
            startOfMonth.setMonth(now.getMonth() - 1);
            return { lastActive: { $gte: startOfMonth } };
        default:
            return {};
    }
}

function calculateStats(earners: MongoTopEarner[]): Stats {
    const totalEarnings = earners.reduce((sum, item) => sum + item.totalEarnings, 0);
    const totalAds = earners.reduce((sum, item) => sum + item.adsWatched, 0);
    const avgEarnings = earners.length > 0 ? totalEarnings / earners.length : 0;

    return {
        totalEarnings,
        totalAds,
        avgEarnings
    };
}

function formatLastActive(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} mins ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const timeframe = (url.searchParams.get('timeframe') || 'all') as TimeFrame;
        const limit = parseInt(url.searchParams.get('limit') || '10');

        const timeframeFilter = getTimeframeFilter(timeframe);
        
        const topEarners = await TopEarner.find({
            timeframe,
            ...timeframeFilter
        })
        .sort({ totalEarnings: -1 })
        .limit(limit)
        .lean() as MongoTopEarner[];

        const formattedEarners = topEarners.map((earner, index) => ({
            id: earner._id.toString(),
            name: earner.name,
            avatar: earner.avatar,
            totalEarnings: earner.totalEarnings,
            adsWatched: earner.adsWatched,
            rank: index + 1,
            country: earner.country,
            lastActive: formatLastActive(earner.lastActive)
        }));

        const stats = calculateStats(topEarners);

        console.log('Top Earners:', topEarners);
        return NextResponse.json({
            success: true,
            data: {
                earners: formattedEarners,
                stats
            }
        });
    } catch (error) {
        console.error('Error fetching top earners:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        // Validate required fields
        if (!data.userId || !data.name) {
            return NextResponse.json({ 
                error: 'Missing required fields' 
            }, { status: 400 });
        }

        // Update or create top earner records for all timeframes
        const timeframes: TimeFrame[] = ['today', 'week', 'month', 'all'];
        const updates = await Promise.all(timeframes.map(async timeframe => {
            const result = await TopEarner.findOneAndUpdate(
                { userId: data.userId, timeframe },
                {
                    ...data,
                    timeframe,
                    lastActive: new Date()
                },
                {
                    new: true,
                    upsert: true,
                    runValidators: true
                }
            ).lean() as MongoTopEarner | null;

            return result ? {
                ...result,
                _id: result._id.toString()
            } : null;
        }));

        return NextResponse.json({
            success: true,
            data: updates.filter(Boolean)
        });
    } catch (error) {
        console.error('Error updating top earner:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
