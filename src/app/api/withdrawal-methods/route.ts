import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import WithdrawalMethod from '@/app/[lang]/models/WithdrawalMethod';

export async function GET() {
    try {
        await dbConnect();
        
        const withdrawalMethods = await WithdrawalMethod.find({ status: 'active' })
            .select('-__v -createdAt -updatedAt')
            .lean();

        return NextResponse.json(withdrawalMethods);
    } catch (error) {
        console.error('Error fetching withdrawal methods:', error);
        return NextResponse.json(
            { error: 'Failed to fetch withdrawal methods' },
            { status: 500 }
        );
    }
} 