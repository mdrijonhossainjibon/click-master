import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import DirectLink from '@/models/DirectLink';
import User from '@/models/User';
import ClickHistory from '@/models/ClickHistory';
import connectDB from '@/lib/db';

// Function to validate hash
const validateHash = (id: string, timestamp: number, hash: string) => {
  const str = `${id}_${timestamp}_${process.env.HASH_SECRET || 'secret'}`;
  const expectedHash = Buffer.from(str).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
  return hash === expectedHash;
};

// Function to check if the click is within valid time window
const isValidTimeWindow = (timestamp: number) => {
  const now = Date.now();
  const timeDiff = now - timestamp;
  // The click timestamp should be around 30 seconds old
  // Allow 5 seconds buffer for network delays and clock skew
  console.log('Time diff:', timeDiff); // Debug log
  return timeDiff >= 28000 && timeDiff <= 35000;
};

// Cache to store processing clicks
const processingClicks = new Map<string, number>();

// Cleanup old entries from processing cache every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of processingClicks.entries()) {
    if (now - timestamp > 60000) { // Remove entries older than 1 minute
      processingClicks.delete(key);
    }
  }
}, 60000);

// Increment click count for a direct link
export async function POST(req: Request) {
  const headersList = headers();
  const ipAddress = (headersList instanceof Headers ? headersList.get('x-forwarded-for') : null) || 'unknown';
  const userAgent = (headersList instanceof Headers ? headersList.get('user-agent') : null) || 'unknown';
  let requestData = null;
  
  try {
    const data = await req.json();
    if (typeof data === 'object' && data !== null &&
        'id' in data && 'userId' in data && 'timestamp' in data && 'hash' in data) {
      requestData = data as { id: string; userId: string; timestamp: number; hash: string; };
    }

    if (!requestData?.id || !requestData?.userId || !requestData?.timestamp || !requestData?.hash) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const { id, userId, timestamp, hash } = requestData;

    // Check for duplicate processing
    const clickKey = `${id}_${userId}_${timestamp}`;
    if (processingClicks.has(clickKey)) {
      return NextResponse.json(
        { error: 'Click already being processed' },
        { status: 429 }
      );
    }

    // Add to processing cache
    processingClicks.set(clickKey, Date.now());

    try {
      await connectDB();

      // First check if this click already exists in history
      const existingClick = await ClickHistory.findOne({
        userId,
        linkId: id,
        clientTimestamp: timestamp
      });

      if (existingClick) {
        return NextResponse.json(
          { error: 'Click already recorded' },
          { status: 429 }
        );
      }

      // Validate hash
      if (!validateHash(id, timestamp, hash)) {
        await ClickHistory.create({
          userId,
          linkId: id,
          clientTimestamp: timestamp,
          reward: 0,
          status: 'failed',
          ipAddress,
          userAgent,
          errorMessage: 'Invalid request signature'
        });
        return NextResponse.json(
          { error: 'Invalid request signature' },
          { status: 403 }
        );
      }

      // Validate time window
      if (!isValidTimeWindow(timestamp)) {
        await ClickHistory.create({
          userId,
          linkId: id,
          clientTimestamp: timestamp,
          reward: 0,
          status: 'failed',
          ipAddress,
          userAgent,
          errorMessage: 'Invalid time window'
        });
        return NextResponse.json(
          { error: 'Invalid time window for click' },
          { status: 403 }
        );
      }

      const link = await DirectLink.findById(id);

      if (!link) {
        await ClickHistory.create({
          userId,
          linkId: id,
          clientTimestamp: timestamp,
          reward: 0,
          status: 'failed',
          ipAddress,
          userAgent,
          errorMessage: 'Link not found'
        });
        return NextResponse.json(
          { error: 'Link not found' },
          { status: 404 }
        );
      }

      // Only increment clicks for active links
      if (link.status !== 'active') {
        await ClickHistory.create({
          userId,
          linkId: id,
          clientTimestamp: timestamp,
          reward: 0,
          status: 'failed',
          ipAddress,
          userAgent,
          errorMessage: 'Link is not active'
        });
        return NextResponse.json(
          { error: 'Link is not active' },
          { status: 400 }
        );
      }

      const user = await User.findOne({ telegramId: userId.toString() });

      if (!user) {
        await ClickHistory.create({
          userId,
          linkId: id,
          clientTimestamp: timestamp,
          reward: 0,
          status: 'failed',
          ipAddress,
          userAgent,
          errorMessage: 'User not found'
        });
        return NextResponse.json(
          { error: 'User not found' },
          { status: 400 }
        );
      }

      // Check for recent clicks in history
      const recentClick = await ClickHistory.findOne({
        userId,
        linkId: id,
        status: 'success',
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      if (recentClick) {
        await ClickHistory.create({
          userId,
          linkId: id,
          clientTimestamp: timestamp,
          reward: 0,
          status: 'failed',
          ipAddress,
          userAgent,
          errorMessage: 'Recent click exists'
        });
        return NextResponse.json(
          { error: 'You have already received a reward for this link recently' },
          { status: 429 }
        );
      }

      // Update user balance and record click
      user.balance +=  Number(link.rewardPerClick);
      await user.save();

      // Record successful click in history
      await ClickHistory.create({
        userId,
        linkId: id,
        clientTimestamp: timestamp,
        reward: Number(link.rewardPerClick),
        status: 'success',
        ipAddress,
        userAgent
      });

      const updatedLink = await DirectLink.findByIdAndUpdate(
        id,
        {
          $inc: { totalClicks: 1 }
        },
        { new: true }
      );

      return NextResponse.json({
        status: 'success',
        result: updatedLink,
      });

    } finally {
      // Remove from processing cache regardless of success/failure
      processingClicks.delete(clickKey);
    }

  } catch (error) {
    console.error('Error incrementing link clicks:', error);
    // Record error in history if possible
    if (requestData) {
      try {
        await ClickHistory.create({
          userId: requestData.userId,
          linkId: requestData.id,
          clientTimestamp: requestData.timestamp,
          reward: 0,
          status: 'failed',
          ipAddress,
          userAgent,
          errorMessage: error instanceof Error ? error.message : 'Internal Server Error'
        });
      } catch (historyError) {
        console.error('Failed to record error in history:', historyError);
      }
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 