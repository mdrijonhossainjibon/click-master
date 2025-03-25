import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Withdrawal, { IWithdrawal } from '@/app/models/Withdrawal';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { Types } from 'mongoose';
import User from '@/models/User';

interface UserPopulated {
    _id: Types.ObjectId;
    name: string;
    email: string;
}

interface WithdrawalPopulated extends Omit<IWithdrawal, 'userId'> {
    userId: UserPopulated;
}

export async function GET(request: Request, context: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();
    
        const { id } = await context.params;
        const withdrawal = await Withdrawal.findById(id)
            .populate('userId', 'name email')
            .lean();

        if (!withdrawal) {
            return NextResponse.json(
                { error: 'Withdrawal not found' },
                { status: 404 }
            );
        }
         
        return NextResponse.json(withdrawal);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, context: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const { id } = context.params;
        const data = await request.json();
        const { status } = data;

        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) {
            return NextResponse.json(
                { error: 'Withdrawal not found' },
                { status: 404 }
            );
        }

        // If rejecting a pending withdrawal, refund the user's balance
        if (withdrawal.status === 'pending' && status === 'rejected') {
            await User.findByIdAndUpdate(withdrawal.userId, {
                $inc: { balance: withdrawal.amount }
            });
        }

        withdrawal.status = status;
        await withdrawal.save();

        return NextResponse.json(withdrawal);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, context: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const { id } = context.params;
        const withdrawal = await Withdrawal.findById(id);

        if (!withdrawal) {
            return NextResponse.json(
                { error: 'Withdrawal not found' },
                { status: 404 }
            );
        }

        // Only allow deletion of pending withdrawals
        if (withdrawal.status !== 'pending') {
            return NextResponse.json(
                { error: 'Can only delete pending withdrawals' },
                { status: 400 }
            );
        }

        // Refund the user's balance
        await User.findByIdAndUpdate(withdrawal.userId, {
            $inc: { balance: withdrawal.amount }
        });

        await withdrawal.deleteOne();

        return NextResponse.json({ message: 'Withdrawal deleted successfully' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
