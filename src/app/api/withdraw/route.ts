import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        const { network, amount, walletAddress, userId } = await request.json();

        // Validate request data
        if (!network || !amount || !walletAddress || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const numAmount = parseFloat(amount);

        // Validate amount
        if (isNaN(numAmount) || numAmount < 0.002 || numAmount > 10.000) {
            return NextResponse.json({ error: 'Invalid withdrawal amount' }, { status: 400 });
        }

        // Validate wallet address based on network
        const addressRegex = {
            bitget: /^[0-9a-zA-Z]{34,42}$/,
            binance: /^0x[0-9a-fA-F]{40}$/
        };

        if (!addressRegex[network as keyof typeof addressRegex].test(walletAddress)) {
            return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
        }

        await connectDB();

        // Find user and check balance
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.balance < numAmount) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        // Update user balance
        user.balance -= numAmount;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Withdrawal request submitted successfully',
            newBalance: user.balance
        });
    } catch (error) {
        console.error('Withdrawal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}