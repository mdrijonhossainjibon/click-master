import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
    try {
        // Get user session
        const session: any = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to database
        await dbConnect();

        // Find user and select specific fields
        const user = await User.findById(session.user._id)
        .select('fullName  balance adsWatched totalEarnings lastWatchTime createdAt updatedAt telegramId username lastResetDate');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Calculate time remaining if lastWatchTime exists
        const timeRemaining = user.lastWatchTime
            ? Math.max(0, 15 - Math.floor((Date.now() - new Date(user.lastWatchTime).getTime()) / 1000))
            : 0;

        // Calculate level based on ads watched (1 level per 100 ads)
        const level = Math.max(1, Math.floor(user.adsWatched / 100) + 1);

        // Determine rank based on level
        let rank = 'Beginner';
        if (level >= 10) rank = 'Master';
        else if (level >= 7) rank = 'Expert';
        else if (level >= 5) rank = 'Advanced';
        else if (level >= 3) rank = 'Intermediate';

        // Calculate ads required for current level
        const adsRequiredForLevel = (level - 1) * 100;

        // Calculate how many ads left to reach the next level
        const adsToNextLevel = (level * 100) - user.adsWatched;

        const userData = {
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            balance: user.balance,
            adsWatched: user.adsWatched,
            totalEarnings: user.totalEarnings,
            lastWatchTime: user.lastWatchTime,
            timeRemaining,
            level,
            rank,
            adsRequiredForLevel,
            adsToNextLevel,
            telegramId: user.telegramId,
            lastResetDate: user.lastResetDate,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return NextResponse.json({
            success: true,
            result: { user: userData }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
