import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { handleApiError } from '@/lib/errorHandler';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const type = searchParams.get('type');

        await connectDB();

        const query: any = {};
        if (userId) query.userId = userId;
        if (type && ['withdrawal', 'earning'].includes(type)) query.type = type;

        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({ transactions });
    } catch (error) {
        const errorResponse = { error: 'Failed to fetch transactions', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId, type, amount, network, walletAddress } = await request.json();

        await connectDB();

        // Find user and validate
        const user = await User.findById(userId);
        if (!user) {
            const errorResponse = { error: 'User not found', status: 404 };
            handleApiError(errorResponse);
            return NextResponse.json(errorResponse, { status: 404 });
        }

        // Create transaction
        const transaction = await Transaction.create({
            userId,
            type,
            amount,
            network,
            walletAddress,
            status: 'pending'
        });

        // Update user balance based on transaction type
        if (type === 'withdrawal') {
            if (user.balance < amount) {
                await Transaction.findByIdAndUpdate(transaction._id, { status: 'failed' });
                const errorResponse = { error: 'Insufficient balance', status: 400 };
                handleApiError(errorResponse);
                return NextResponse.json(errorResponse, { status: 400 });
            }
            user.balance -= amount;
        } else if (type === 'earning') {
            user.balance += amount;
            user.totalEarnings += amount;
        }

        await user.save();
        return NextResponse.json({ transaction, newBalance: user.balance });
    } catch (error) {
        const errorResponse = { error: 'Failed to create transaction', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, status, txHash } = await request.json();

        await connectDB();
        const transaction = await Transaction.findByIdAndUpdate(
            id,
            { status, txHash, updatedAt: new Date() },
            { new: true }
        );

        if (!transaction) {
            const errorResponse = { error: 'Transaction not found', status: 404 };
            handleApiError(errorResponse);
            return NextResponse.json(errorResponse, { status: 404 });
        }

        return NextResponse.json(transaction);
    } catch (error) {
        const errorResponse = { error: 'Failed to update transaction', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}