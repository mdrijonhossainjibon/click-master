import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { DirectLink, IDirectLink } from '@/models/DirectLink';
import { handleApiError } from '@/lib/errorHandler';

export async function GET() {
    try {
        await connectDB();
        const links = await DirectLink.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, links });
    } catch (error) {
        const errorResponse = { error: 'Failed to fetch links', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectDB();

        // Set default values if not provided
        const linkData = {
            ...body,
            position: body.position || await getNextPosition(),
            icon: body.icon || '🔗',
            gradient: body.gradient || {
                from: 'rose-600',
                to: 'pink-600'
            },
            clicks: body.clicks || 0,
            isActive: body.isActive ?? true,
            category: body.category || 'general'
        };

        const newLink = new DirectLink(linkData);
        await newLink.save();

        return NextResponse.json({ success: true, link: newLink });
    } catch (error: any) {
        console.error('Error creating link:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).reduce((acc: any, key) => {
                acc[key] = error.errors[key].message;
                return acc;
            }, {});
            
            return NextResponse.json({
                success: false,
                error: 'Validation failed',
                validationErrors
            }, { status: 400 });
        }

        const errorResponse = { error: 'Failed to create link', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}

async function getNextPosition(): Promise<number> {
    const lastLink = await DirectLink.findOne().sort({ position: -1 });
    return lastLink ? lastLink.position + 1 : 1;
}
