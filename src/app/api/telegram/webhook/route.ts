 import bot, { handleStart } from '@/bot/telegram';
import { NextResponse } from 'next/server';

let isBotRunning = false;
let startHandler: ((msg: any) => void) | null = null;

export async function GET(request: Request) {
    return NextResponse.json({ 
        status: isBotRunning ? 'running' : 'stopped',
        message: isBotRunning ? 'Bot is running' : 'Bot is stopped'
    });
}

export async function POST(request: Request) {
    try {
        const { action } = await request.json();
        
        if (action === 'start' && !isBotRunning) {
            startHandler = (msg: any) => handleStart(msg);
            bot.onText(/\/start/, startHandler);
            isBotRunning = true;
            return NextResponse.json({ 
                status: 'success', 
                message: 'Bot started successfully' 
            });
        } 
        else if (action === 'stop' && isBotRunning) {
            // Stop the bot by removing the start command handler
            if (startHandler) {
                const eventEmitter = bot as any;
                eventEmitter.off('text', startHandler);
                startHandler = null;
            }
            isBotRunning = false;
            return NextResponse.json({ 
                status: 'success', 
                message: 'Bot stopped successfully' 
            });
        }
        
        return NextResponse.json({ 
            status: 'error', 
            message: `Invalid action or bot is already ${isBotRunning ? 'running' : 'stopped'}` 
        }, { status: 400 });
        
    } catch (error) {
        return NextResponse.json({ 
            status: 'error', 
            message: 'Failed to process request' 
        }, { status: 500 });
    }
}