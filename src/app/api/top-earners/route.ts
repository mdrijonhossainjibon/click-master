import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

import { authOptions } from '@/lib/authOptions';

interface TopEarner {
    id: string;
    name: string;
    avatar?: string;
    totalEarnings: number;
    adsWatched: number;
    rank: number;
    country?: string;
    lastActive: string;
    isCurrentUser?: boolean;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'today';
        const session : any = await getServerSession(authOptions);

        await connectDB();

        let dateFilter: { createdAt?: { $gte: Date } } = {};
        if (period === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            dateFilter = {
                createdAt: {
                    $gte: today
                }
            };
        }

        // Get top earners using MongoDB aggregation
        const topEarners = await User.find(dateFilter).sort({ totalEarned: -1 }).limit(10);
 
        // Format response
        const formattedEarners: TopEarner[] = topEarners.map((user, index) => ({
            id: user._id.toString(),
            name: user.fullName || user.username || user.telegramId,
            totalEarnings: user.balance,
            adsWatched: user.adsWatched || 0,
            earned: user.balance,
            rank: index + 1,
            lastActive: user.lastWatchTime?.toISOString() || new Date().toISOString(),
            isCurrentUser: session?.user?._id === user._id.toString()
        }));

        return NextResponse.json({
            success: true,
            data: {
                earners: formattedEarners
            }
        });
    } catch (error) {
        console.error('Error fetching top earners:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch top earners' },
            { status: 500 }
        );
    }
}
