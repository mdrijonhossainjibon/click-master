'use client';

import { useEffect, useState } from 'react';

import TopEarnersModal from './components/TopEarnersModal';
import RulesModal from './components/RulesModal';
import AboutModal from './components/AboutModal';
import ProfileModal from './components/ProfileModal';

import UserStats from './components/UserStats';
import DailyProgress from './components/DailyProgress';
import BottomNavigation from './components/BottomNavigation';
 
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStats, watchAdRequest } from '@/modules/private/user/actions';

import { useModals } from './hooks/useModals';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation'
 
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DirectLinks from './components/DirectLinks';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
 

// Client component
export default function Home ( ) {
    const dispatch = useDispatch()
    const router = useRouter();
    const params = useParams();

    const { t } = useTranslation();
    const { data : session , status } = useSession();

    if (status === 'unauthenticated') {
         router.push('/auth');
    }

    // Modal states
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Mock user stats - replace with real data from your state management
    const userStats = {
        balance: 25.50,
        totalEarned: 150.75,
        adsWatched: 45,
        lastWithdrawal: '2025-04-05',
        nextWithdrawal: '2025-04-07',
        level: 3,
        rank: 'Silver',
        telegramId: '@user123',
        joinDate: '2025-03-01',
        withdrawHistory: [
            { amount: 50, date: '2025-04-05', status: 'completed' as const },
            { amount: 25, date: '2025-04-03', status: 'completed' as const },
            { amount: 30, date: '2025-04-01', status: 'pending' as const }
        ],
        achievements: [
            { name: 'First Ad', description: 'Watch your first ad', completed: true },
            { name: 'Daily Goal', description: 'Complete daily ad goal', completed: true },
            { name: 'First Withdrawal', description: 'Make your first withdrawal', completed: true },
            { name: 'Ad Master', description: 'Watch 100 ads', completed: false },
            { name: 'Big Earner', description: 'Earn $100 in total', completed: false }
        ]
    };

    const [autoShowAds, setAutoShowAds] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const {
        isWithdrawalModalOpen,
        isHistoryModalOpen,
        isTopEarnersModalOpen,
        isRulesModalOpen,
        isAboutModalOpen,
        isLiveSupportModalOpen,
        setIsWithdrawalModalOpen,
        setIsHistoryModalOpen,
        setIsTopEarnersModalOpen,
        setIsRulesModalOpen,
        setIsAboutModalOpen,
        setIsLiveSupportModalOpen
    } = useModals();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        
        if (autoShowAds && !isLoading) {
            if (countdown > 0) {
                timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
            } else {
                const showAd = async () => {
                    try {
                        setIsLoading(true);
                        await window.show_9103912?.();
                        dispatch(watchAdRequest());
                        dispatch(fetchUserStats());
                        setCountdown(5); // Reset countdown after successful ad view
                        setIsLoading(false);
                    } catch (err) {
                        setIsLoading(false);
                        setAutoShowAds(false);
                        console.error('Error watching ad:', err);
                        toast.error(err instanceof Error ? err.message : 'Failed to watch ad');
                    }
                };
                
                showAd();
            }
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [autoShowAds, countdown, isLoading, dispatch]);

     
    const handleWatchAd = async () => {
        try {
            setIsLoading(true);
            // Check if the ad script is loaded
            if (typeof window.show_9103912 === 'undefined') {
                throw new Error('Ad system not initialized');
            }
            
            await window.show_9103912();
            dispatch(watchAdRequest());
            
        } catch (err) {
            console.error('Error watching ad:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to watch ad');
        } finally {
            setIsLoading(false);
        }
    };

    /*  if (userState.loading || adState.loading) {
         return <Loading />;
     }
 
     if (userState.error || adState.error) {
         return (
             <ErrorFallback 
                 error={userState.error || adState.error || 'An error occurred'} 
                 onRetry={() => window.location.reload()  } 
             />
         );
     } */
 
     

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Mobile Header with Profile and Language */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/50 shadow-lg md:hidden">
                <div className="flex items-center justify-between px-4 py-2">
                    {/* Profile Avatar */}
                    <button
                        className="flex items-center gap-2"
                        onClick={() => setIsProfileModalOpen(true)}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md ring-2 ring-purple-400/20">
                            <span className="text-base">👤</span>
                        </div>
                    </button>

                    <LanguageSwitcher />

                </div>
            </header>


            {/* Profile Modal */}
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                dictionary={{
                    profile: 'Profile',
                    balance: 'Current Balance',
                    totalEarned: 'Total Earned',
                    adsWatched: 'Ads Watched',
                    close: 'Close',
                    withdrawHistory: 'Withdrawal History',
                    achievements: 'Achievements',
                    settings: 'Settings',
                    lastWithdrawal: 'Last Withdrawal',
                    nextWithdrawal: 'Next Withdrawal',
                    level: 'Level',
                    rank: 'Rank',
                    telegramId: 'Telegram ID',
                    joinDate: 'Member Since',
                    logout : 'Logout'
                }}
                stats={userStats}
            />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-20 max-w-4xl">
                <div className="bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white rgb-animate py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg text-center leading-tight">
                        Watch Ads & Earn Money
                    </h1>
                    <UserStats />

                    <DailyProgress />

                    {/* Watch Ads Button */}
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={handleWatchAd}
                            /*  disabled={adState.loading || userState.timeRemaining > 0 || userState.adsWatched >= 1000} */
                            className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all duration-300"></div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xl">🎥</span>
                                <span className="text-lg">
                                    {t('navigation.watchAd')}
                                </span>
                            </div>
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setAutoShowAds(!autoShowAds);
                                    setCountdown(5);

                                }}
                                className={`px-4 py-2 rounded-lg font-medium ${autoShowAds
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-green-500 hover:bg-green-600'
                                    } transition-colors duration-300`}
                            /*  disabled={adState.loading || userState.timeRemaining > 0 || userState.adsWatched >= 1000} */
                            >
                                {autoShowAds ?  t('navigation.stopAutoAds') : t('navigation.startAutoAds')}
                            </button>
                            {autoShowAds && (
                                <span className="text-sm text-gray-300">
                                    {t('navigation.nextAdIn')}
                                </span>
                            )}
                        </div>
                    </div>

                    <DirectLinks   />
                </div>
            </main>

            {/* Bottom Navigation */}
            <BottomNavigation
                onWithdraw={() => setIsWithdrawalModalOpen(true)}
                onTopEarners={() => setIsTopEarnersModalOpen(true)}
                onRules={() => setIsRulesModalOpen(true)}
                onAbout={() => setIsAboutModalOpen(true)}
                onSupport={() => setIsLiveSupportModalOpen(true)}
                dictionary={{
                    withdraw: 'Withdraw',
                    topEarners: 'Top Earners',
                    rules: 'Rules',
                    about: 'About',
                    support: 'Support'
                }}
            />

            {/* Modals */}
            <TopEarnersModal
                isOpen={isTopEarnersModalOpen}
                onClose={() => setIsTopEarnersModalOpen(false)}
                dictionary={{
                    topEarners: 'Top Earners',
                    close: 'Close',
                    today: 'Today',
                    allTime: 'All Time',
                    rank: 'Rank',
                    user: 'User',
                    earned: 'Earned'
                }}
                stats={{
                    today: [
                        { rank: 1, username: '@winner123', earned: 250.50, isCurrentUser: false },
                        { rank: 2, username: '@star_user', earned: 180.75, isCurrentUser: false },
                        { rank: 3, username: '@user123', earned: 150.25, isCurrentUser: true },
                        { rank: 4, username: '@ads_master', earned: 120.00, isCurrentUser: false },
                        { rank: 5, username: '@crypto_fan', earned: 95.50, isCurrentUser: false },
                    ],
                    allTime: [
                        { rank: 1, username: '@crypto_king', earned: 2500.50, isCurrentUser: false },
                        { rank: 2, username: '@ads_pro', earned: 2100.25, isCurrentUser: false },
                        { rank: 3, username: '@master_user', earned: 1800.75, isCurrentUser: false },
                        { rank: 4, username: '@user123', earned: 1500.50, isCurrentUser: true },
                        { rank: 5, username: '@daily_earner', earned: 1200.00, isCurrentUser: false },
                    ]
                }}
            />
            <RulesModal
                isOpen={isRulesModalOpen}
                onClose={() => setIsRulesModalOpen(false)}
                dictionary={{
                    rules: 'Rules & Guidelines',
                    close: 'Close',
                    general: 'General Rules',
                    earnings: 'Earnings',
                    withdrawals: 'Withdrawals',
                    safety: 'Safety & Security'
                }}
            />
            <AboutModal
                isOpen={isAboutModalOpen}
                onClose={() => setIsAboutModalOpen(false)}
                dictionary={{
                    about: 'About ClickMaster',
                    close: 'Close',
                    welcome: 'Welcome to ClickMaster',
                    description: 'Your trusted platform for earning rewards by watching ads',
                    features: 'Features',
                    howItWorks: 'How It Works',
                    support: 'Support',
                    version: 'Version'
                }}
            />
            {/*  <LiveSupportModal
                isOpen={isLiveSupportModalOpen}
                onClose={() => setIsLiveSupportModalOpen(false)}
                userId={telegramUser?.id.toString() || '709148502'}
                userName={telegramUser?.username || 'jibon'}
            />
  */}

        </div>
    );
}
