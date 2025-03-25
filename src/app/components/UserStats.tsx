'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Tooltip } from 'antd';
import { DollarCircleOutlined, PlayCircleOutlined, ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface UserData {
    balance: number;
    totalEarnings: number;
    adsWatched: number;
    timeRemaining: number;
}

export default function UserStats() {
   

    const { loading , balance , adsWatched , timeRemaining } = useSelector((state: RootState) => state.userStats.userState);


     

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

    

    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-gray-800/70 hover:scale-[1.02] cursor-help">
                <Tooltip title="Your current balance. Watch more ads to increase it!" placement="top">
                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center text-yellow-400 mb-1">
                            <DollarCircleOutlined className="text-xl mr-2" />
                            <span className="text-2xl font-bold animate-pulse">
                                ${ balance.toFixed(4)}
                            </span>
                        </div>
                        <div className="text-sm text-gray-400">Available Balance</div>
                        <div className="text-sm text-emerald-400">
                            ৳{( balance * 100).toFixed(2)}
                        </div>
                         
                    </div>
                </Tooltip>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-gray-800/70 hover:scale-[1.02] cursor-help">
                <Tooltip title="Number of ads you've watched today" placement="top">
                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center text-emerald-400 mb-1">
                            <PlayCircleOutlined className="text-xl mr-2" />
                            <span className="text-2xl font-bold">
                                { adsWatched}
                            </span>
                        </div>
                        <div className="text-sm text-gray-400">Ads Watched Today</div>
                        { timeRemaining > 0 ? (
                            <div className="flex items-center justify-center text-red-400 mt-1 animate-pulse">
                                <ClockCircleOutlined className="mr-1" />
                                <span>Wait { timeRemaining}s</span>
                            </div>
                        ) : (
                            <div className="text-xs text-emerald-400 mt-1">
                                Ready to watch!
                            </div>
                        )}
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}
