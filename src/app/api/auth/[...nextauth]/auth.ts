import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import  dbConnect  from '@/lib/db';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                
                telegramId : { label: 'Telegram ID', type: 'text' }
            },
            async authorize(credentials) {
                 
                if (!credentials?.telegramId) {
                    throw new Error('Invalid credentials');
                }
                  
                await dbConnect();

                const user = await User.findOne({  telegramId: credentials.telegramId });
                if (!user) {
                    throw new Error('Invalid credentials');
                }
 
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.fullName,
                    role: user.role,
                    telegramId: user.telegramId
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user } : any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token } : any) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
  
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET
};
