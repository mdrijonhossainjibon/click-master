import     { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CoinbaseProvider from "next-auth/providers/coinbase";
import connectDB from "@/lib/db";
import User from "@/models/User";
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions : AuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
                telegramId: { type: "text" },
                
            },
            async authorize(credentials) {
                try {
                    await connectDB();
                    console.log(credentials)
                    let existingUser = null;
                    if(credentials?.email){
                        existingUser = await User.findOne({ email: credentials?.email });
                    }
                    if(credentials?.telegramId){
                        
                        existingUser = await User.findOne({ telegramId: credentials?.telegramId });
                    }
                    console.log(existingUser)
                    if (!existingUser) {
                        throw new Error('CredentialsSignin');
                    }
                    return existingUser;
                } catch (error) {
                    return false
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
        CoinbaseProvider({
            clientId: process.env.COINBASE_CLIENT_ID || "",
            clientSecret: process.env.COINBASE_CLIENT_SECRET || "",
        }),
    
        
    ],
    pages: {
        error: '/auth/error',
        signIn: '/auth'
    },
    callbacks: {
        
        async signIn({ user, account } :  any) {
         try {
          
            await connectDB();
            const existingUser = await User.findOne({ email :  user.email });
            if (!existingUser) {
                return false
            }
            return true
         } catch (error) {
           return false
         }
        },
        async session({ session, token } : any) {
            try {
                await connectDB();
                session.user._id = token._id;
                session.user.email = token.email;
                session.user.role = token.role;  
                return session;
            } catch (error) {
                console.error("Error in session callback:", error);
                return session;
            }
        },
        async jwt({ token, user } : any) {
            if (user) {
                  token._id = user._id;
                  token.email = user?.email;
                  token.role = user?.role;
            }
            return token;
        },
    },
}