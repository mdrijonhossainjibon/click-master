import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { ResponseCookies } from 'next/dist/server/web/spec-extension/cookies';
import User from '@/models/User';
import connectDB from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { telegramId, firstName, lastName, username } = body;

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Telegram ID is required' },
        { status: 400 }
      );
    }
    await connectDB();
    let user = await User.findOne({ telegramId });

    if (!user) {
       return NextResponse.json(
         { error: 'User not found' },
         { status: 404 }
       );
    } 

    const users = {
      _id : user._id,
      telegramId: user.telegramId,
      fullName : user.fullName,
      username: user.username,
      balance: user.balance,
      adsWatched: user.adsWatched,
      lastWatchTime: user.lastWatchTime,
      lastResetDate: user.lastResetDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

   const token = await new SignJWT( users )
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2m')
      .sign(JWT_SECRET);

    // Set JWT token in HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: users 
    });

    const cookieStore = response.cookies as unknown as ResponseCookies;
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
 
  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({ user: payload });
  } catch (error) {
    const response = NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
    response.cookies.delete('auth_token');
    return response;
  }
}

export async function DELETE(req: Request) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth_token');
  return response;
}
