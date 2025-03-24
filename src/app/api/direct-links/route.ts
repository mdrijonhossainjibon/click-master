import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { DirectLink, IDirectLink } from '@/models/DirectLink';

type MongoDirectLink = IDirectLink & {
    _id: mongoose.Types.ObjectId;
    __v: number;
    createdAt: Date;
    updatedAt: Date;
};

export async function GET(req: Request) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const category = url.searchParams.get('category') || 'adult';
        
        const links = await DirectLink.find({
            category,
            isActive: true
        })
        .sort({ position: 1 })
        .lean() as MongoDirectLink[];

        const formattedLinks = links.map(link => ({
            id: link._id.toString(),
            title: link.title,
            url: link.url,
            icon: link.icon,
            gradient: link.gradient,
            clicks: link.clicks,
            position: link.position
        }));

        return NextResponse.json({
            success: true,
            data: formattedLinks
        });
    } catch (error) {
        console.error('Error fetching direct links:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const { linkId } = await req.json();

        if (!linkId) {
            return NextResponse.json({ 
                error: 'Link ID is required' 
            }, { status: 400 });
        }

        const link = await DirectLink.findByIdAndUpdate(
            linkId,
            {
                $inc: { clicks: 1 },
                lastClicked: new Date()
            },
            { new: true }
        ).lean() as MongoDirectLink | null;

        if (!link) {
            return NextResponse.json({ 
                error: 'Link not found' 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                id: link._id.toString(),
                url: link.url,
                clicks: link.clicks
            }
        });
    } catch (error) {
        console.error('Error updating link clicks:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
