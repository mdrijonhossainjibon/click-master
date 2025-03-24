import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { handleApiError } from '@/lib/errorHandler';

export async function POST(request: Request) {
    try {
        const { userId, adType } = await request.json();
        await connectDB();

        // Find user and validate
        const user = await User.findById(userId);
        if (!user) {
            const errorResponse = { error: 'User not found', status: 404 };
            handleApiError(errorResponse);
            return NextResponse.json(errorResponse, { status: 404 });
        }

        // Check if enough time has passed since last ad (15 seconds)
        const now = new Date();
        if (user.lastWatchTime && now.getTime() - user.lastWatchTime.getTime() < 15000) {
            const errorResponse = { error: 'Please wait before watching another ad', status: 429 };
            handleApiError(errorResponse);
            return NextResponse.json(errorResponse, { status: 429 });
        }

        // Calculate reward based on ad type
        const reward = adType === 'auto' ? 0.001 : 0.002;

        // Update user stats
        user.balance += reward;
        user.totalEarnings += reward;
        user.adsWatched += 1;
        user.lastWatchTime = now;
        await user.save();

        // Create earning transaction
        await Transaction.create({
            userId: user._id,
            type: 'earning',
            amount: reward,
            status: 'completed'
        });

        return NextResponse.json({
            success: true,
            newBalance: user.balance,
            reward,
            adsWatched: user.adsWatched
        });
    } catch (error) {
        const errorResponse = { error: 'Failed to process ad view', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}