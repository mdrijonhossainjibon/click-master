import     { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CoinbaseProvider from "next-auth/providers/coinbase";
import connectDB from "@/lib/db";
import User from "@/models/User";
import CredentialsProvider from "next-auth/providers/credentials"


// Helper function to get client IP and device info
const getClientInfo = (req: any) => {
    // Default values in case we can't get the information
    let ip = 'unknown';
    let deviceId = 'unknown';
    
    try {
        // Check if req exists and has headers
        if (req && req.headers) {
            // Get IP address from various headers
            const forwardedFor = req.headers['x-forwarded-for'];
            const realIp = req.headers['x-real-ip'];
            ip = forwardedFor ? forwardedFor.split(',')[0] : realIp || req.socket?.remoteAddress || 'unknown';
            
            // Get user agent for device identification
            deviceId = req.headers['user-agent'] || 'unknown';
        } else if (req && typeof req === 'object') {
            // Try to extract from request object directly
            ip = req.ip || req.connection?.remoteAddress || 'unknown';
            deviceId = req.userAgent || 'unknown';
        }
    } catch (error) {
        console.error('Error getting client info:', error);
    }
    
    return {
        ip,
        deviceId
    };
};

export const authOptions : AuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
                telegramId: { type: "text" },
                username : { type : 'text'},
                fullName : { type : 'text'},
                referCode: { type: 'text' }
            },
            async authorize(credentials, req) {
                try {
                    await connectDB();
 
                    
                    // Get client IP and device info
                    const clientInfo = getClientInfo(req);
                    const { ip, deviceId } = clientInfo;
                    
                    let existingUser;
                    let referralUser;

                    // Check for referral code if provided
                    if (credentials?.referCode) {
                        referralUser = await User.findOne({ referralCode: credentials.referCode });
                    }
                    
                    // Check for existing user by email or telegramId
                    if(credentials?.email){
                        existingUser = await User.findOne({ email: credentials?.email });
                    }

                 

                    if(!existingUser && credentials?.email){
                        throw new Error('Email not Found or password in incorrect')
                    }
                    if(credentials?.telegramId && !credentials.password){
                        throw new Error('Password is required')
                    }

                    

                    if(credentials?.telegramId){
                        existingUser = await User.findOne({ telegramId: credentials?.telegramId });
                        if(!credentials.username ) {
                            throw new Error('@username not set  please set it in your telegram profile  ')
                        }
                        if(!credentials.fullName){
                            throw new Error('full name not set  please set it in your telegram profile ')
                        }
                        
                        // Create new user if telegramId not found
                        if (!existingUser && credentials.username && credentials.fullName) {
                            // Generate unique referral code (you can customize the format)
                            const uniqueReferralCode = 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
                            
                            existingUser = await User.create({
                                telegramId: credentials.telegramId,
                                username: credentials.username,
                                fullName: credentials.fullName,
                                ipAddress: ip,
                                deviceId: deviceId,
                                role: 'user',
                                lastLoginIp: ip,
                                lastLoginDevice: deviceId,
                                createdAt: new Date(),
                                referralCode: uniqueReferralCode,
                                referredBy: referralUser ? referralUser._id : null
                            });

                            // Update referrer's statistics if there was a valid referral
                            if (referralUser) {
                                await User.findByIdAndUpdate(referralUser._id, {
                                    $inc: { referralCount: 1 },
                                    $push: { referrals: existingUser._id }
                                });
                            }
                        }
                    }
                    
                    // If user exists, update their last login info
                    if (existingUser) {
                        existingUser.lastLoginIp = ip;
                        existingUser.lastLoginDevice = deviceId;
                        await existingUser.save();
                        return existingUser;
                    }
                    
                    // Check if there's an account from the same device or IP
                    const existingDeviceUser = await User.findOne({
                        $or: [
                            { deviceId: deviceId },
                            { ipAddress: ip }
                        ]
                    });
                    
                    if (existingDeviceUser) {
                        // Return a custom error message
                        throw new Error('DeviceIpRestriction');
                    }
  
                } catch (error) {

                 
                    throw error;
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
        
        async signIn({ user, account } : any) {
            await connectDB();
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                return false;
            }
            
            // Set the user's _id and role for the token
            user._id = existingUser._id;
            user.role = existingUser.role;
            
            return true;
        },
        
        async session({ session, token } : any) {
            try {
                
                session.user._id = token._id;
                session.user.email = token.email;
                session.user.role = token.role;  
                return session;
            } catch (error) {
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