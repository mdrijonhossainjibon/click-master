import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import  dbConnect  from '@/lib/db';
import User from '@/models/User';
 

export async function GET() {
    try {
        // Get user session
        const session : any = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to database
        await dbConnect();

        // Find user and select specific fields
        const user = await User.findOne({ email: session.user.email })
            .select('fullName email balance adsWatched totalEarnings lastWatchTime')
            

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Calculate time remaining if lastWatchTime exists
        const timeRemaining = user.lastWatchTime 
            ? Math.max(0, 15 - Math.floor((Date.now() - new Date(user.lastWatchTime).getTime()) / 1000))
            : 0;

            const users = { fullName : user.fullName, email : user.email, balance : user.balance, adsWatched : user.adsWatched, totalEarnings : user.totalEarnings, lastWatchTime : user.lastWatchTime , timeRemaining }

        return NextResponse.json({
            success: true,
            data: {
                 user : users
            }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
