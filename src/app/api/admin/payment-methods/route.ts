import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import WithdrawalMethod from '@/app/[lang]/models/WithdrawalMethod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// GET - Fetch all payment methods
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const methods = await WithdrawalMethod.find({}).sort({ createdAt: -1 });
        return NextResponse.json(methods);
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payment methods' },
            { status: 500 }
        );
    }
}

// POST - Create new payment method
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        await dbConnect();

        const newMethod = await WithdrawalMethod.create(body);
        return NextResponse.json(newMethod, { status: 201 });
    } catch (error) {
        console.error('Error creating payment method:', error);
        return NextResponse.json(
            { error: 'Failed to create payment method' },
            { status: 500 }
        );
    }
} 