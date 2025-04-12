import { NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import Withdrawal from '@/app/[lang]/models/Withdrawal';

// Constants for conversion
const USD_TO_BDT_RATE = 100; // 1 USD = 100 BDT
const MIN_CRYPTO_AMOUNT = 0.5;
const MAX_CRYPTO_AMOUNT = 50; // Maximum 50 USDT withdrawal
const MIN_BDT_AMOUNT = 50;
const MAX_BDT_AMOUNT = 5000;

// Helper function to convert USDT to BDT
function convertUSDTtoBDT(usdtAmount: number): number {
    return usdtAmount * USD_TO_BDT_RATE;
}

// Helper function to convert BDT to USDT
function convertBDTtoUSDT(bdtAmount: number): number {
    return bdtAmount / USD_TO_BDT_RATE;
}

// Helper function to validate Bangladeshi phone number
function validateBangladeshiPhoneNumber(number: string): boolean {
    // Remove any non-digit characters
    const cleanNumber = number.replace(/\D/g, '');
    
    // Check if it's exactly 10 digits
    if (cleanNumber.length !== 10) {
        return false;
    }

    // Check if it starts with valid Bangladesh operator codes
    const validPrefixes = ['13', '14', '15', '16', '17', '18', '19'];
    const prefix = cleanNumber.substring(0, 2);
    
    return validPrefixes.includes(prefix);
}

// Helper function to validate crypto address
function validateCryptoAddress(address: string, method: string): boolean {
    const addressRegex = {
        bitget: /^[0-9a-zA-Z]{34,42}$/,
        binance: /^0x[0-9a-fA-F]{40}$/
    };

    if (method === 'bitget' || method === 'binance') {
        return addressRegex[method].test(address);
    }

    return true; // For non-crypto methods
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const telegramId = searchParams.get('telegramId');
        await dbConnect();

        const session = await getServerSession(authOptions);

        if (session) {
            const withdrawals = await Withdrawal.find({})
                .sort({ createdAt: -1 })
                .populate('userId', 'name email username')
                .lean();
            const withdrawalsWithConversion = withdrawals.map(w => ({
                ...w,
                bdtAmount: w.method.toLowerCase() === 'bkash' || w.method.toLowerCase() === 'nagad'
                    ? w.amount
                    : convertUSDTtoBDT(w.amount)
            }));

            return NextResponse.json({ result: withdrawalsWithConversion });
        }

        if (!telegramId) {
            return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
        }

        const user = await User.findOne({ telegramId: telegramId.toString() });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const withdrawals = await Withdrawal.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email username')
            .lean();

        const withdrawalsWithConversion = withdrawals.map(w => ({
            ...w,
            bdtAmount: w.method.toLowerCase() === 'bkash' || w.method.toLowerCase() === 'nagad'
                ? w.amount
                : convertUSDTtoBDT(w.amount)
        }));

        return NextResponse.json({ result: withdrawalsWithConversion });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();

        const data = await req.json();
        const { method, amount, recipient, network } = data;

        // Validate required fields
        if (!method || !amount || !recipient) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate recipient based on method
        if (method === 'bkash' || method === 'nagad') {
            if (!validateBangladeshiPhoneNumber(recipient)) {
                return NextResponse.json(
                    { error: 'Invalid phone number format' },
                    { status: 400 }
                );
            }
        } else if (!validateCryptoAddress(recipient, method)) {
            return NextResponse.json(
                { error: 'Invalid wallet address' },
                { status: 400 }
            );
        }

        const isCryptoPayment = method === 'binance' || method === 'bitget';
        const amountInUSDT = isCryptoPayment ? parseFloat(amount) : convertBDTtoUSDT(parseFloat(amount));

        // Validate amount based on payment method
        if (isCryptoPayment) {
            if (amountInUSDT < MIN_CRYPTO_AMOUNT) {
                return NextResponse.json(
                    { error: `Minimum withdrawal amount is ${MIN_CRYPTO_AMOUNT} USDT` },
                    { status: 400 }
                );
            }
            if (amountInUSDT > MAX_CRYPTO_AMOUNT) {
                return NextResponse.json(
                    { error: `Maximum withdrawal amount is ${MAX_CRYPTO_AMOUNT} USDT` },
                    { status: 400 }
                );
            }
        } else {
            const bdtAmount = parseFloat(amount);
            if (bdtAmount < MIN_BDT_AMOUNT) {
                return NextResponse.json(
                    { error: `Minimum withdrawal amount is ${MIN_BDT_AMOUNT} BDT` },
                    { status: 400 }
                );
            }
            if (bdtAmount > MAX_BDT_AMOUNT) {
                return NextResponse.json(
                    { error: `Maximum withdrawal amount is ${MAX_BDT_AMOUNT} BDT` },
                    { status: 400 }
                );
            }
        }

        const user = await User.findById(session.user._id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user has sufficient balance (always check in USDT)
        if (user.balance < amountInUSDT) {
            return NextResponse.json(
                { error: 'Insufficient balance' },
                { status: 400 }
            );
        }

        // Create withdrawal record
        const withdrawal = await Withdrawal.create({
            userId: user._id,
            method,
            amount: amountInUSDT, // Always store amount in USDT
            recipient,
            network,
            status: 'pending',
            originalAmount: parseFloat(amount), // Store original amount for reference
            currency: isCryptoPayment ? 'USDT' : 'BDT'
        });

        // Update user balance (in USDT)
        await User.findByIdAndUpdate(user._id, {
            $inc: { balance: -amountInUSDT }
        }, { new: true });

        return NextResponse.json({
            message: 'Withdrawal request submitted successfully',
            withdrawal: {
                ...withdrawal.toObject(),
                bdtAmount: isCryptoPayment ? convertUSDTtoBDT(amountInUSDT) : parseFloat(amount)
            }
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: any) {
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: 'Missing withdrawal ID' }, { status: 400 });
        }

        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) {
            return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
        }

        if (withdrawal.status !== 'pending') {
            return NextResponse.json({ error: 'Can only cancel pending withdrawals' }, { status: 400 });
        }

        // Refund the USDT amount to user's balance
        await User.findByIdAndUpdate(withdrawal.userId, {
            $inc: { balance: withdrawal.amount }
        });

        await Withdrawal.findByIdAndDelete(id);

        return NextResponse.json({
            message: 'Withdrawal cancelled successfully',
            refundedAmount: withdrawal.amount,
            refundedAmountBDT: convertUSDTtoBDT(withdrawal.amount)
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to cancel withdrawal' }, { status: 500 });
    }
} 