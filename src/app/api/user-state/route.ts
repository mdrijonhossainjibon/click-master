import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { handleApiError } from '@/lib/errorHandler';

const directLinks = {
    link1: 'https://example1.com',
    link2: 'https://example2.com'
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            const errorResponse = { error: 'User ID is required', status: 400 };
            handleApiError(errorResponse);
            return NextResponse.json(errorResponse, { status: 400 });
        }

        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            const errorResponse = { error: 'User not found', status: 404 };
            handleApiError(errorResponse);
            return NextResponse.json(errorResponse, { status: 404 });
        }

        const now = new Date();
        const timeRemaining = user.lastWatchTime 
            ? Math.max(0, 15 - Math.floor((now.getTime() - user.lastWatchTime.getTime()) / 1000))
            : 0;

        return NextResponse.json({
            success: true,
            balance: user.balance,
            adsWatched: user.adsWatched,
            timeRemaining,
            directLinks
        });
    } catch (error) {
        const errorResponse = { error: 'Failed to fetch user state', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}