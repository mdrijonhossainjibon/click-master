import NextAuth, { DefaultSession, NextAuthOptions, User as NextAuthUser, Session, Account, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            balance?: number;
            totalEarnings?: number;
            adsWatched?: number;
            role?: string;
        } & DefaultSession["user"]
    }
}

export const authOptions: NextAuthOptions = {
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
    ],
    pages: {
        signIn: "/admin/auth",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                await connectDB();
                const existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    return false;
                }
                return true;
            } catch (error) {
                return false;
            }
        },
        async session({ session, token }) {
            try {
                await connectDB();
                if (session?.user?.email) {
                    const dbUser = await User.findOne({ username: session.user.email });
                    if (dbUser) {
                        session.user.id = dbUser._id.toString();
                        session.user.balance = dbUser.balance;
                        session.user.totalEarnings = dbUser.totalEarnings;
                        session.user.adsWatched = dbUser.adsWatched;
                        session.user.role = dbUser.role;
                    }
                }
                return session;
            } catch (error) {
                console.error("Error in session callback:", error);
                return session;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };