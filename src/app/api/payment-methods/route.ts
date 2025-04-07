import { NextResponse } from 'next/server';

import PaymentMethod from '@/models/PaymentMethod';
import connectDB from '@/lib/db';

const paymentMethods = [
  {
    id: '1',
    name: 'bKash',
    type: 'mobile_banking',
    icon: '/images/bkash.png',
    status: 'active',
    minimumAmount: 50,
    maximumAmount: 25000,
    processingTime: '1-2 hours',
    fees: '1.5%'
  },
  {
    id: '2',
    name: 'Nagad',
    type: 'mobile_banking',
    icon: '/images/nagad.png',
    status: 'active',
    minimumAmount: 50,
    maximumAmount: 25000,
    processingTime: '1-2 hours',
    fees: '1.5%'
  },
  {
    id: '3',
    name: 'Bitcoin',
    type: 'crypto',
    icon: '/images/bitcoin.png',
    status: 'active',
    minimumAmount: 100,
    maximumAmount: 1000000,
    processingTime: '10-30 minutes',
    fees: '1%'
  },
  {
    id: '4',
    name: 'Ethereum',
    type: 'crypto',
    icon: '/images/ethereum.png',
    status: 'active',
    minimumAmount: 100,
    maximumAmount: 1000000,
    processingTime: '2-5 minutes',
    fees: '2%'
  },
  {
    id: '5',
    name: 'USDT',
    type: 'crypto',
    icon: '/images/usdt.png',
    status: 'active',
    minimumAmount: 10,
    maximumAmount: 1000000,
    processingTime: '1-3 minutes',
    fees: '1%'
  }
];

export async function GET() {
  try {
    await connectDB();
    const paymentMethods = await PaymentMethod.find({});
    
    return NextResponse.json({ 
      success: true,
      result: paymentMethods
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const newPaymentMethod = await PaymentMethod.create(data);
    
    return NextResponse.json({ 
      success: true,
      result: newPaymentMethod
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const data = await request.json();
  
  // Here you would typically update the payment method
  // For now, we'll just return a success response
  return NextResponse.json({ 
    success: true,
    message: 'Payment method updated successfully'
  });
}

export async function DELETE(request: Request) {
  const data = await request.json();
  
  // Here you would typically delete the payment method
  // For now, we'll just return a success response
  return NextResponse.json({ 
    success: true,
    message: 'Payment method deleted successfully'
  });
} 