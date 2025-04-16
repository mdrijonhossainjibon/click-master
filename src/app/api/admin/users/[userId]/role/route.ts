import { NextResponse } from 'next/server';
import {   getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { handleApiError } from '@/lib/errorHandler';
import { authOptions } from '@/lib/authOptions';

 
export async function PUT(request: Request, context: any) {
    try {
        const session  : any = getServerSession(authOptions);
        
         if(session.user?.role === 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
         }
        
        await connectDB();
      

        const { role } = await request.json();
        const { userId } = await context.params;

        // Validate role
        const allowedRoles = ['user', 'admin'];
        if (!allowedRoles.includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role. Allowed roles are: user, admin' },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role, updatedAt: new Date() },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        const errorResponse = { error: 'Failed to update user role', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}
