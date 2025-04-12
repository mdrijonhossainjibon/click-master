import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import WithdrawalMethod from '@/app/[lang]/models/WithdrawalMethod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// POST - Add network to payment method
export async function POST(req: Request, context : any) {
    try {
        const { id } = await context.params ;

        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        await dbConnect();

        const method = await WithdrawalMethod.findById(id);
        if (!method) {
            return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
        }

        method.networks.push(body);
        await method.save();

        return NextResponse.json(method);
    } catch (error) {
        console.error('Error adding network:', error);
        return NextResponse.json(
            { error: 'Failed to add network' },
            { status: 500 }
        );
    }
}

// PUT - Update network in payment method
export async function PUT(req: Request, context : any) {
    try {
        const { id } = await context.params ;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { networkId, ...updateData } = await req.json();
        await dbConnect();

        const method = await WithdrawalMethod.findOneAndUpdate(
            { _id: id, 'networks.id': networkId },
            { $set: { 'networks.$': updateData } },
            { new: true }
        );

        if (!method) {
            return NextResponse.json({ error: 'Payment method or network not found' }, { status: 404 });
        }

        return NextResponse.json(method);
    } catch (error) {
        console.error('Error updating network:', error);
        return NextResponse.json(
            { error: 'Failed to update network' },
            { status: 500 }
        );
    }
}

// DELETE - Remove network from payment method
export async function DELETE(req: Request, context : any) {
    try {
        const { id } = await context.params ;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { networkId } = await req.json();
        await dbConnect();

        const method = await WithdrawalMethod.findByIdAndUpdate(
              id,
            { $pull: { networks: { id: networkId } } },
            { new: true }
        );

        if (!method) {
            return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
        }

        return NextResponse.json(method);
    } catch (error) {
        console.error('Error deleting network:', error);
        return NextResponse.json(
            { error: 'Failed to delete network' },
            { status: 500 }
        );
    }
} 