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

export async function PUT(request: Request, context: any) {
    try {
        await connectDB();
        const session = await getServerSession();

        if (!session?.user?.email || !(await isAdmin(session.user.email))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { balance, operation } = await request.json();
        const { userId } = await context.params;

        // Validate inputs
        if (typeof balance !== 'number' || balance < 0) {
            return NextResponse.json(
                { error: 'Invalid balance. Balance must be a non-negative number.' },
                { status: 400 }
            );
        }

        if (operation !== 'add' && operation !== 'subtract') {
            return NextResponse.json(
                { error: 'Invalid operation. Operation must be "add" or "subtract".' },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        let newBalance = user.balance;
        if (operation === 'add') {
            newBalance += balance;
        } else if (operation === 'subtract') {
            if (balance > newBalance) {
                return NextResponse.json(
                    { error: 'Insufficient balance for subtraction.' },
                    { status: 400 }
                );
            }
            newBalance -= balance;
        }

        user.balance = newBalance;
        user.updatedAt = new Date();
        await user.save();

        return NextResponse.json({ user });
    } catch (error  : any) {
        console.error('Error updating user balance:', error);
        const errorResponse = { error: 'Failed to update user balance' };
        handleApiError(error);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}
