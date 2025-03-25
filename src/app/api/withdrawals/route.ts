import { NextResponse } from 'next/server';
 
import Withdrawal from '@/app/models/Withdrawal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Session } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

interface CustomSession extends Session {
    user: {
        id: string;
        email?: string | null;
        name?: string | null;
        image?: string | null;
    };
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions) as CustomSession | null;
        
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const withdrawals = await Withdrawal.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .lean();

        return NextResponse.json(withdrawals);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions) as CustomSession | null;
        
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { method, amount, recipient } = data;

        // Validate required fields
        if (!method || !amount || !recipient) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate amount
        if (amount < 0.002) {
            return NextResponse.json(
                { error: 'Minimum withdrawal amount is 0.002' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user has sufficient balance
        if (user.balance < amount) {
            return NextResponse.json(
                { error: 'Insufficient balance' },
                { status: 400 }
            );
        }

        // Create withdrawal and update user balance in a transaction
        const withdrawal = await Withdrawal.create({
            userId: user._id,
            method,
            amount: parseFloat(amount),
            recipient,
            status: 'pending'
        });

        // Update user balance
        await User.findByIdAndUpdate(user._id, {
            $inc: { balance: -amount }
        });

        return NextResponse.json(withdrawal);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
