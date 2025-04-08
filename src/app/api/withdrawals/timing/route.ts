import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Withdrawal from '@/app/[lang]/models/Withdrawal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// Constants
const WITHDRAWAL_COOLDOWN_HOURS = 24; // 24 hours between withdrawals

export async function GET(req: Request) {
    try {
        const session : any = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findById(session.user._id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get the user's latest withdrawal
        const latestWithdrawal = await Withdrawal.findOne({
            userId: user._id
        }).sort({ createdAt: -1 });

        const now = new Date();
        let lastWithdrawalDate = null;
        let nextWithdrawalDate = null;

        if (latestWithdrawal) {
            lastWithdrawalDate = latestWithdrawal.createdAt;
            
            // Calculate next withdrawal time (24 hours after last withdrawal)
            const nextWithdrawalTime = new Date(latestWithdrawal.createdAt);
            nextWithdrawalTime.setHours(nextWithdrawalTime.getHours() + WITHDRAWAL_COOLDOWN_HOURS);
            
            // If next withdrawal time is in the future, use it
            if (nextWithdrawalTime > now) {
                nextWithdrawalDate = nextWithdrawalTime;
            }
        }

        return NextResponse.json({
            lastWithdrawal: lastWithdrawalDate ? lastWithdrawalDate.toISOString() : null,
            nextWithdrawal: nextWithdrawalDate ? nextWithdrawalDate.toISOString() : null,
            canWithdraw: !nextWithdrawalDate || nextWithdrawalDate <= now
        });
    } catch (error: any) {
        console.error('Error fetching withdrawal timing:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch withdrawal timing' },
            { status: 500 }
        );
    }
}
