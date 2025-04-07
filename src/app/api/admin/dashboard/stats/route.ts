import { NextResponse } from 'next/server';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get total withdrawals
    const totalWithdrawals = await Transaction.countDocuments({ type: 'WITHDRAWAL' });

    // Get pending withdrawals
    const pendingWithdrawals = await Transaction.countDocuments({
      type: 'WITHDRAWAL',
      status: 'PENDING'
    });

    // Get new users in last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newUsersLast24h = await User.countDocuments({
      createdAt: {
        $gte: twentyFourHoursAgo
      }
    });

    return NextResponse.json({
      response: {
        stats: {
          totalUsers,
          totalWithdrawals,
          pendingWithdrawals,
          newUsersLast24h
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
