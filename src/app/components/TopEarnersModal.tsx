'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface TopEarnersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface TopEarner {
    id: string;
    name: string;
    avatar: string;
    totalEarnings: number;
    adsWatched: number;
    rank: number;
    country: string;
    lastActive: string;
}

interface Stats {
    totalEarnings: number;
    totalAds: number;
    avgEarnings: number;
}

export default function TopEarnersModal({ isOpen, onClose }: TopEarnersModalProps) {
    const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
    const [topEarners, setTopEarners] = useState<TopEarner[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalEarnings: 0,
        totalAds: 0,
        avgEarnings: 0
    });
    const [loading, setLoading] = useState(true);

    const getCountryFlag = (countryCode: string) => {
        const baseUrl = 'https://flagcdn.com/24x18';
        const code = countryCode.toLowerCase();
        return `${baseUrl}/${code}.png`;
    };

    useEffect(() => {
        const fetchTopEarners = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/top-earners?timeframe=${timeFilter}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch top earners');
                }

                const result = await response.json();
                if (result.success) {
                    setTopEarners(result.data.earners);
                    setStats(result.data.stats);
                }
            } catch (error) {
                console.error('Error fetching top earners:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchTopEarners();
        }
    }, [isOpen, timeFilter]);

    if (!isOpen) return null;

    const modalClasses = `fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-0 md:items-center md:p-4`;
    const contentClasses = `bg-gray-800 w-full h-full md:rounded-2xl md:w-auto md:h-auto md:max-w-4xl md:max-h-[80vh] border border-gray-700 shadow-xl overflow-hidden transition-all duration-300`;

    const getRankBadge = (rank: number) => {
        switch (rank) {
            case 1:
                return '👑';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return rank;
        }
    };

    return (
        <div className={modalClasses}>
            <div className={contentClasses}>
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <span className="mr-2">🏆</span>
                            Top Earners
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                        >
                            <span className="text-gray-400 hover:text-white">✕</span>
                        </button>
                    </div>
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
                        {(['today', 'week', 'month', 'all'] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                                    timeFilter === filter
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[calc(100vh-180px)] md:h-[60vh] overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="text-purple-500">Loading...</div>
                        </div>
                    ) : topEarners.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                            No top earners found for this time period
                        </div>
                    ) : (
                        topEarners.map((earner) => (
                            <div
                                key={earner.id}
                                className="bg-gray-700/30 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <Avatar
                                                size={48}
                                                src={earner.avatar}
                                                icon={<UserOutlined />}
                                                className="bg-purple-600"
                                            />
                                            <span className="absolute -top-1 -right-1 text-xl">
                                                {getRankBadge(earner.rank)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold flex items-center">
                                                {earner.name}
                                                <span className="ml-2">
                                                    <Image
                                                        src={getCountryFlag(earner.country)}
                                                        alt={earner.country}
                                                        width={24}
                                                        height={18}
                                                        className="inline-block"
                                                    />
                                                </span>
                                            </h3>
                                            <p className="text-gray-400 text-sm">Active {earner.lastActive}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end space-x-1 mb-1">
                                            <Image
                                                src="/images/usdt.png"
                                                alt="USDT"
                                                width={16}
                                                height={16}
                                            />
                                            <p className="text-white font-bold">${earner.totalEarnings.toFixed(3)}</p>
                                        </div>
                                        <p className="text-sm text-purple-400">
                                            {earner.adsWatched.toLocaleString()} ads watched
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6">
                    <div className="bg-gray-700/30 rounded-xl p-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">Total Earnings</p>
                                <div className="flex items-center justify-center space-x-1">
                                    <Image
                                        src="/images/usdt.png"
                                        alt="USDT"
                                        width={16}
                                        height={16}
                                    />
                                    <p className="text-white font-bold">
                                        ${stats.totalEarnings.toFixed(3)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">Total Ads</p>
                                <p className="text-purple-400 font-bold">
                                    {stats.totalAds.toLocaleString()}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">Avg. Earnings</p>
                                <div className="flex items-center justify-center space-x-1">
                                    <Image
                                        src="/images/usdt.png"
                                        alt="USDT"
                                        width={16}
                                        height={16}
                                    />
                                    <p className="text-green-400 font-bold">
                                        ${stats.avgEarnings.toFixed(3)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
