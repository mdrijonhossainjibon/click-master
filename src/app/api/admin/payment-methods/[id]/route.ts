import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import WithdrawalMethod from '@/app/[lang]/models/WithdrawalMethod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';


// GET - Fetch single payment method
export async function GET(req: Request, context : any  ) {
    
    try {
        const { id } = await context.params ;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const method = await WithdrawalMethod.findById(id);
        
        if (!method) {
            return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
        }

        return NextResponse.json(method);
    } catch (error) {
        console.error('Error fetching payment method:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payment method' },
            { status: 500 }
        );
    }
}

// PUT - Update payment method
export async function PUT(req: Request , context : any) {
    try {
        const session = await getServerSession(authOptions);

        const { id } = await context.params ;

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        await dbConnect();

        const updatedMethod = await WithdrawalMethod.findByIdAndUpdate(
             id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedMethod) {
            return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
        }

        return NextResponse.json(updatedMethod);
    } catch (error) {
        console.error('Error updating payment method:', error);
        return NextResponse.json(
            { error: 'Failed to update payment method' },
            { status: 500 }
        );
    }
}

// DELETE - Delete payment method
export async function DELETE(req: Request,  context : any ) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await context.params ;

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        if(!id){
            return NextResponse.json({ error :  'id is missing'} ,{ status : 400 })
        }
      
        const deletedMethod = await WithdrawalMethod.findByIdAndDelete(id);

        if (!deletedMethod) {
            return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Payment method deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment method:', error);
        return NextResponse.json(
            { error: 'Failed to delete payment method' },
            { status: 500 }
        );
    }
} 