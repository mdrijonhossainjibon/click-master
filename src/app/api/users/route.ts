import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { handleApiError, handleValidationError, handleApiSuccess } from '@/lib/errorHandler';
import { MongoError } from 'mongodb';
import { headers } from 'next/headers';

// Helper function to get client IP and device info
const getClientInfo = (request: Request) => {
    // Default values in case we can't get the information
    let ip = 'unknown';
    let deviceId = 'unknown';
    
    try {
        // Get IP address from various headers
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        ip = forwardedFor ? forwardedFor.split(',')[0] : realIp || 'unknown';
        
        // Get user agent for device identification
        deviceId = request.headers.get('user-agent') || 'unknown';
    } catch (error) {
        console.error('Error getting client info:', error);
    }
    
    return {
        ip,
        deviceId
    };
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        const status = searchParams.get('status');
        const dateRange = searchParams.get('dateRange');
        const search = searchParams.get('search');

        await connectDB();

        // Build query
        const query: any = {};
        
        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { telegramId: { $regex: search, $options: 'i' } }
            ];
        }

        if (dateRange) {
            const now = new Date();
            let startDate = new Date();

            switch (dateRange) {
                case 'today':
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                default:
                    startDate = new Date(0); // Beginning of time
            }

            query.createdAt = { $gte: startDate };
        }

        // Execute query with pagination
        const skip = (page - 1) * pageSize;
        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize),
            User.countDocuments(query)
        ]);

        const { message } = handleApiSuccess('Users fetched successfully');
        return NextResponse.json({ message, data: users, total, page, pageSize });
    } catch (error) {
        const { error: errorMessage, status } = handleApiError({
            message: error instanceof Error ? error.message : 'Failed to fetch users',
            status: 500
        });
        return NextResponse.json({ error: errorMessage }, { status });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectDB();
        
        // Get client IP and device info
        const clientInfo = getClientInfo(request);
        const { ip, deviceId } = clientInfo;
        
        // Check if this is a credential-based account (has telegramId)
        const isCredentialAccount = body.telegramId;
        
        // Only apply device/IP restrictions for credential-based accounts
        if (isCredentialAccount) {
            // Check if there's an account from the same device or IP
            const existingDeviceUser = await User.findOne({
                $or: [
                    { deviceId: deviceId },
                    { ipAddress: ip }
                ]
            });
            
            if (existingDeviceUser) {
                return NextResponse.json(
                    { error: 'Account creation not allowed from this device or IP address' },
                    { status: 403 }
                );
            }
        }
        
        // Set default values
        const userData = {
            ...body,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
            deviceId: deviceId,
            ipAddress: ip
        };
        
        const user = await User.create(userData);
        const { message } = handleApiSuccess('User created successfully');
        return NextResponse.json({ message, user });
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            const { error: errorMessage, status } = handleValidationError(error);
            return NextResponse.json({ error: errorMessage }, { status });
        }
        if (error instanceof MongoError) {
            const { error: errorMessage, status } = handleApiError(error);
            return NextResponse.json({ error: errorMessage }, { status });
        }
        const { error: errorMessage, status } = handleApiError({
            message: error instanceof Error ? error.message : 'Failed to create user',
            status: 500
        });
        return NextResponse.json({ error: errorMessage }, { status });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;
        
        await connectDB();
        updateData.updatedAt = new Date();
        
        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            const { error: errorMessage, status } = handleApiError({
                message: 'User not found',
                status: 404
            });
            return NextResponse.json({ error: errorMessage }, { status });
        }
        
        const { message } = handleApiSuccess('User updated successfully');
        return NextResponse.json({ message, user });
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            const { error: errorMessage, status } = handleValidationError(error);
            return NextResponse.json({ error: errorMessage }, { status });
        }
        if (error instanceof MongoError) {
            const { error: errorMessage, status } = handleApiError(error);
            return NextResponse.json({ error: errorMessage }, { status });
        }
        const { error: errorMessage, status } = handleApiError({
            message: error instanceof Error ? error.message : 'Failed to update user',
            status: 500
        });
        return NextResponse.json({ error: errorMessage }, { status });
    }
}