import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
 
import { handleApiError } from '@/lib/errorHandler';
import { DirectLink, IDirectLink } from '@/models/DirectLink';

 
 

export async function PUT(request: Request, context: any) {
    try {
        const { id } = await  context.params;
        const body = await request.json();
        await connectDB();

        const updatedLink = await DirectLink.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!updatedLink) {
            return NextResponse.json({ error: "Link not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, link: updatedLink });
    } catch (error) {
        console.error("Error updating link:", error);
        return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: any) {
    try {
        const { id } = await context.params;
        await connectDB();
        const deletedLink = await DirectLink.findByIdAndDelete(id);

        if (!deletedLink) {
            return NextResponse.json({ error: "Link not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting link:", error);
        return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
    }
}
