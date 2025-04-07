import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { handleApiError } from '@/lib/errorHandler';

async function isAdmin(email: string) {
    await connectDB();
    const user = await User.findOne({ email });
    return user?.role === 'admin';
}

export async function PUT(  request: Request,  context: any) {
    try {
        await connectDB();
        const session = await getServerSession();
        if (!session?.user?.email || !(await isAdmin(session.user.email))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { status } = await request.json();
        
        const { userId } = await context.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        const errorResponse = { error: 'Failed to update user status', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}
