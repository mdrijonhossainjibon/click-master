import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import { handleApiError } from '@/lib/errorHandler';
import User from '@/models/User';

async function isAdmin(email: string) {
    await connectDB();
    const user = await User.findOne({ username: email });
    return user?.isAdmin === true;
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email || !(await isAdmin(session.user.email))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');

        await connectDB();

        const query: any = {};
        if (status) query.status = status;
        if (type) query.type = type;

        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'username')
            .limit(50);

        const stats = {
            totalTransactions: await Transaction.countDocuments(),
            pendingWithdrawals: await Transaction.countDocuments({ type: 'withdrawal', status: 'pending' }),
            totalWithdrawn: (await Transaction.aggregate([
                { $match: { type: 'withdrawal', status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]))[0]?.total || 0,
            totalEarnings: (await Transaction.aggregate([
                { $match: { type: 'earning', status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]))[0]?.total || 0
        };

        return NextResponse.json({ transactions, stats });
    } catch (error) {
        const errorResponse = { error: 'Failed to fetch transactions', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email || !(await isAdmin(session.user.email))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { transactionId, status, txHash } = await request.json();
        await connectDB();

        const transaction = await Transaction.findByIdAndUpdate(
            transactionId,
            { status, txHash, updatedAt: new Date() },
            { new: true }
        ).populate('userId', 'username');

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json(transaction);
    } catch (error) {
        const errorResponse = { error: 'Failed to update transaction', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}