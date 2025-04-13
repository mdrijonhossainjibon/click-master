import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import History from '@/models/History';
import { handleApiError } from '@/lib/error';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(request: Request) {
  try {
    const session : any = await getServerSession(authOptions);
      
    if (!session) {
      const errorResponse = { error: 'Unauthorized', status: 401 };
      handleApiError(errorResponse);
      return NextResponse.json(errorResponse, { status: 401 });
    }
    await connectDB();

    // Find user and validate
    const user = await User.findById(session?.user._id);
    if (!user) {
      const errorResponse = { error: 'User not found', status: 404 };
      handleApiError(errorResponse);
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Check if enough time has passed since last ad (15 seconds)
    const now = new Date();
    if (user.lastWatchTime && now.getTime() - user.lastWatchTime.getTime() < 15000) {
      const errorResponse = { error: 'Please wait before watching another ad', status: 429 };
      handleApiError(errorResponse);
      return NextResponse.json(errorResponse, { status: 429 });
    }

    const reward = 0.002;
    // Update user stats
    user.balance += reward;
    user.totalEarnings += reward;
    user.adsWatched += 1;
    user.lastWatchTime = now;

    // Create history record for ad watch
    await History.create({
      userId: user._id,
      activityType: 'ad_watch',
      amount: reward,
      description: 'Watched an advertisement',
      metadata: {
        adNumber: user.adsWatched,
        deviceInfo: request.headers.get('user-agent') || 'unknown',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      }
    });

    // Handle referral commission if user was referred
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        const commission = reward * 0.1; // 10% commission
        referrer.balance += commission;
        referrer.totalEarnings += commission;
        await referrer.save();

        // Create history record for referral commission
        await History.create({
          userId: referrer._id,
          activityType: 'referral_commission',
          amount: commission,
          description: 'Referral commission from ad watch',
          metadata: {
            referralId: user._id.toString(),
            referralName: user.fullName,
            originalAmount: reward
          }
        });
      }
    }

    await user.save();

    const result = { 
      newBalance: user.balance, 
      reward, 
      adsWatched: user.adsWatched, 
      _id: user._id 
    };

    return NextResponse.json({ 
      success: true, 
      message: 'Ad watch recorded successfully', 
      result 
    });

  } catch (error) {
    console.error('Error processing ad watch:', error);
    const errorResponse = { error: 'Failed to process ad watch', status: 500 };
    handleApiError(errorResponse);
    return NextResponse.json(
      { error: errorResponse.error, message: 'Internal Server Error', status: errorResponse.status }, 
      { status: errorResponse.status }
    );
  }
}