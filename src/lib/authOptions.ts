import     { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CoinbaseProvider from "next-auth/providers/coinbase";
import connectDB from "@/lib/db";
import User from "@/models/User";


export const authOptions : AuthOptions = {
    providers: [
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
        signIn: "/admin/auth",
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
                if (session?.user?.email) {
                    const dbUser = await User.findOne({ username: session.user.email });
                    if (dbUser) {
                        session.user.id = dbUser._id;
                        session.user.balance = dbUser.balance;
                        session.user.totalEarnings = dbUser.totalEarnings;
                        session.user.adsWatched = dbUser.adsWatched;
                        session.user.role = dbUser.role;
                        session.user.isAdmin = dbUser.role === 'admin';
                    }
                }
                return session;
            } catch (error) {
                console.error("Error in session callback:", error);
                return session;
            }
        },
        async jwt({ token, user } : any) {
            if (user) {
                token.id = user.id;
                await connectDB();
                const dbUser = await User.findOne({ email : user.email});
                token.role = dbUser?.role;
                token.isAdmin = dbUser?.role === 'admin';
 
            }
            return token;
        },
    },
}