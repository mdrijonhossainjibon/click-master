import { NextResponse } from 'next/server';

import { Message, IMessage } from '@/models/Message';
import connectDB from '@/lib/db';

const responses = [
    "Thank you for reaching out! How can I assist you today?",
    "Hello! I'm here to help. What can I do for you?",
    "Welcome to ClickMasterAds support! How may I help you?",
    "Hi there! I'm your support agent. What brings you here today?",
    "Thanks for contacting support! How can I make your day better?",
];

export async function POST(req: Request) {
    try {
        await connectDB();
        const { message, userId, userName } = await req.json();

        // Create and save user message
        const userMessage = await Message.create({
            text: message,
            sender: 'user',
            userId,
            userName,
            timestamp: new Date(),
            status: 'sent'
        });

        // Create and save support response
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const supportMessage = await Message.create({
            text: randomResponse,
            sender: 'support',
            userId: 'support',
            userName: 'Support Agent',
            timestamp: new Date(Date.now() + 2000),
            status: 'sent'
        });

        return NextResponse.json({ 
            success: true, 
            messages: [
                {
                    id: userMessage._id.toString(),
                    text: userMessage.text,
                    sender: userMessage.sender,
                    userId: userMessage.userId,
                    userName: userMessage.userName,
                    timestamp: userMessage.timestamp.toISOString(),
                    status: userMessage.status
                },
                {
                    id: supportMessage._id.toString(),
                    text: supportMessage.text,
                    sender: supportMessage.sender,
                    userId: supportMessage.userId,
                    userName: supportMessage.userName,
                    timestamp: supportMessage.timestamp.toISOString(),
                    status: supportMessage.status
                }
            ]
        });
    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Get user's chat history, sorted by timestamp
        const messages = await Message.find({
            $or: [
                { userId },
                { sender: 'support' }
            ]
        })
        .sort({ timestamp: 1 })
        .lean()
        .exec();

        return NextResponse.json({
            success: true,
            data: messages.map(msg => ({
                id: (msg as any)._id.toString(),
                text: msg.text,
                sender: msg.sender,
                userId: msg.userId,
                userName: msg.userName,
                timestamp: new Date(msg.timestamp).toISOString(),
                status: msg.status
            }))
        });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
