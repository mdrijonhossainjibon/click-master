import { NextResponse } from 'next/server';
 
import PaymentMethod from '@/models/PaymentMethod';
import connectDB from '@/lib/db';

export async function PUT(request: Request, context : any) {
  try {
    await connectDB();
    const data = await request.json();

    const { id } = await context.params;
    
    const updatedMethod = await PaymentMethod.findByIdAndUpdate(
      id ,
      { ...data },
      { new: true, runValidators: true }
    );

    if (!updatedMethod) {
      return NextResponse.json({ 
        success: false,
        message: 'Payment method not found'
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      result: updatedMethod
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, context : any) {
  try {
    await connectDB();

    const { id } = await context.params;
    
    const deletedMethod = await PaymentMethod.findByIdAndDelete(id);

    if (!deletedMethod) {
      return NextResponse.json({ 
        success: false,
        message: 'Payment method not found'
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      message: error.message
    }, { status: 500 });
  }
} 