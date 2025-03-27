import TelegramBot  from 'node-telegram-bot-api';
import User from '../models/User';
import dbConnect from '../lib/dbConnect';

const token = process.env.TELEGRAM_BOT_TOKEN!;
const webAppUrl = 'https://click-master-lime.vercel.app/' 

// Create bot instance without polling (for webhook mode)
const bot = new TelegramBot(token , { polling : true });

export async function handleStart(msg: { chat: { id: number }, from?: { id: number, first_name?: string, last_name?: string, username?: string } }) {
    const chatId = msg.chat.id;
    const userId = msg.from?.id.toString();
    const firstName = msg.from?.first_name || '';
    const lastName = msg.from?.last_name || '';
    const username = msg.from?.username;

   
    if (!userId) {
        return bot.sendMessage(chatId, 'Error: Could not identify user');
    }

    await dbConnect();

    try {
        // Check if user exists
        let user = await User.findOne({ telegramId : userId.toString() });
 

        if (!user) {
            // Create new user
            user = await User.create({
                telegramId: userId,
                fullName: `${firstName} ${lastName}`.trim(),
                username: username,
                status: 'active',
                role: 'user',
                balance: 0,
                totalEarnings: 0,
                lastWatchTime: null,
                adsWatched: 0,
                lastResetDate: null
            });
   
            await bot.sendMessage(
                chatId,
                `Welcome ${firstName}! Your account has been created successfully.`,
                {
                    reply_markup: {
                        inline_keyboard: [[
                            {
                                text: '🎯 Open Mini App',
                                web_app: { url: webAppUrl }
                            }
                        ]]
                    }
                }
            );
        } else {
            // Existing user
            await bot.sendMessage(
                chatId,
                `Welcome back ${firstName}!`,
                {
                    reply_markup: {
                        inline_keyboard: [[
                            {
                                text: '🎯 Open Mini App',
                                web_app: { url: webAppUrl }
                            }
                        ]]
                    }
                }
            );
        }
    } catch (error: any) {
        console.error('Error in handleStart:', error);
        await bot.sendMessage(chatId, 'Sorry, there was an error processing your request. Please try again later.');
    }
}

export async function handleUpdate(update: { message?: { chat: { id: number }, from?: { id: number, first_name?: string, last_name?: string, username?: string }, text?: string }, callback_query?: { id: string, message?: { chat: { id: number } } } }) {
    try {
        // Handle /start command
        if (update.message?.text === '/start') {
            await handleStart(update.message);
        }
        
        // Handle callback queries
        if (update.callback_query) {
            const query = update.callback_query;
            if (query.message) {
                await bot.answerCallbackQuery(query.id);
            }
        }
    } catch (error: any) {
        console.error('Error handling update:', error);
    }
}


export default bot;
