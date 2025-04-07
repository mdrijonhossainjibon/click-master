import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { handleApiError, handleApiSuccess } from '@/lib/errorHandler';
import { MongoError } from 'mongodb';

export async function GET() {
    try {
        await connectDB();
        const now = new Date();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Run all queries in parallel for better performance
        const [
            totalUsers,
            activeUsers,
            inactiveUsers,
            newUsersToday
        ] = await Promise.all([
            User.countDocuments({}),
            User.countDocuments({ status: 'active' }),
            User.countDocuments({ status: 'inactive' }),
            User.countDocuments({
                createdAt: { $gte: startOfDay }
            })
        ]);

        const { message } = handleApiSuccess('Statistics fetched successfully');
        return NextResponse.json({
            message,
            data: {
                totalUsers,
                activeUsers,
                inactiveUsers,
                newUsersToday
            }
        });
    } catch (error) {
        if (error instanceof MongoError) {
            const { error: errorMessage, status } = handleApiError(error);
            return NextResponse.json({ error: errorMessage }, { status });
        }
        const { error: errorMessage, status } = handleApiError({
            message: error instanceof Error ? error.message : 'Failed to fetch statistics',
            status: 500
        });
        return NextResponse.json({ error: errorMessage }, { status });
    }
}
