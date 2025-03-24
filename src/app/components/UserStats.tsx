'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserData {
    fullName: string;
    email: string;
    balance: number;
    adsWatched: number;
    totalEarnings: number;
    timeRemaining: number;
}

interface Session {
    user?: {
        id?: string;
        name?: string;
        email?: string;
    };
}

export default function UserStats() {
    const { data: session } = useSession() as { data: Session | null };
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user/me');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const { data } = await response.json();
                setUserData(data.user);
                setError(null);
                console.log(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.email) {
            fetchUserData();
            // Refresh data every 15 seconds
            const interval = setInterval(fetchUserData, 5000);
            return () => clearInterval(interval);
        }
    }, [ ]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-4 mb-6 animate-pulse">
                <div className="text-center space-y-2">
                    <div className="h-8 bg-gray-700/50 rounded"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-2/3 mx-auto"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-1/2 mx-auto"></div>
                </div>
                <div className="text-center space-y-2">
                    <div className="h-8 bg-gray-700/50 rounded"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-2/3 mx-auto"></div>
                </div>
            </div>
        );
    }
   
    if (error) {
        return (
            <div className="text-red-400 text-center py-4">
                {error}
                <button 
                    onClick={() => window.location.reload()} 
                    className="block mx-auto mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm"
                >
                    Retry
                </button>
            </div>
        );
    }


    if (!userData) {
        return null;
    }

    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                    ${userData.balance }
                </div>
                <div className="text-sm text-gray-400">Balance</div>
                <div className="text-sm text-emerald-400 mt-1">
                    ৳{(userData.balance * 85).toFixed(2)}
                </div>
                <div className="text-xs text-violet-400 mt-1">
                    Total: ${userData.totalEarnings }
                </div>
            </div>
            <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">
                    {userData.adsWatched}
                </div>
                <div className="text-sm text-gray-400">Total Ads</div>
                {userData.timeRemaining > 0 && (
                    <div className="text-xs text-red-400 mt-1">
                        Wait {userData.timeRemaining}s
                    </div>
                )}
            </div>
        </div>
    );
}
