'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import WithdrawalModal from './components/WithdrawalModal';
import WithdrawalHistoryModal from './components/WithdrawalHistoryModal';
import TopEarnersModal from './components/TopEarnersModal';
import RulesModal from './components/RulesModal';
import AboutModal from './components/AboutModal';
import LiveSupportModal from './components/LiveSupportModal';
import UserStats from './components/UserStats';
import DailyProgress from './components/DailyProgress';
import AdButtons from './components/AdButtons';
import DirectLinks from './components/DirectLinks';
import BottomNavigation from './components/BottomNavigation';
import Loading from './components/Loading';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { fetchUserState, fetchDirectLinks, watchAd } from './store';
import { message } from 'antd';

interface DirectLink {
    id: string;
    title: string;
    url: string;
    icon: string;
    gradient: {
        from: string;
        to: string;
    };
    clicks: number;
    position: number;
}

interface UserState {
    balance: number;
    adsWatched: number;
    timeRemaining: number;
    directLinks: Record<string, string>;
}

interface Session {
    user?: {
        id?: string;
        name?: string;
        email?: string;
    };
}

declare var window: any & {
    show_9103912?: () => Promise<void>;
};

export default function Home() {
    const { data: session } = useSession() as { data: Session | null };
    const dispatch = useDispatch<AppDispatch>();

    const userState = useSelector((state: RootState) => state.userStats.userState);
    const directLinks =  { loading: false, error: null, data: [ ]}
    const adState = useSelector((state: RootState) => state.ad);

    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isTopEarnersModalOpen, setIsTopEarnersModalOpen] = useState(false);
    const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isLiveSupportModalOpen, setIsLiveSupportModalOpen] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        if (session?.user?.email) {
            dispatch(fetchUserState(session.user.email));
        }
        dispatch(fetchDirectLinks('adult'));

        // Set up interval to refresh user state every 15 seconds
        const interval = setInterval(() => {
            if (session?.user?.email) {
                dispatch(fetchUserState(session.user.email));
            }
        }, 25000);

        return () => clearInterval(interval);
    }, [session?.user?.email, dispatch]);

    const handleWatchAd = async () => {
        if (!session?.user?.email) {
            alert('Please login to watch ads');
            return;
        }

        const userEmail = session.user.email;

        try {
            window.show_8876485?.().then(async () => {
                try {
                    // Dispatch the watchAd action after the ad is shown
                    const resultAction = await dispatch(watchAd({ userId: userEmail }));
                    
                    if (watchAd.fulfilled.match(resultAction)) {
                        
                        dispatch(fetchUserState(userEmail));
                    } else if (watchAd.rejected.match(resultAction)) {
                        throw new Error(resultAction.payload as string);
                    }
                } catch (error) {
                    throw error;
                }
            });
        } catch (err) {
            console.error('Error watching ad:', err);
            alert(err instanceof Error ? err.message : 'Failed to watch ad');
        }
    };

    const handleAutoShowAds = async () => {
        if (!session?.user?.email) {
            alert('Please login to watch ads');
            return;
        }

        try {
            // Show ads every 15 seconds
            const interval = setInterval(handleWatchAd, 15000);

            // Stop after 1 hour
            setTimeout(() => {
                clearInterval(interval);
            }, 3600000);
        } catch (err) {
            console.error('Error in auto show ads:', err);
            alert(err instanceof Error ? err.message : 'Failed to start auto show');
        }
    };

    const handleDirectLinkClick = async (linkId: string) => {
        try {
            const response = await fetch('/api/direct-links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ linkId })
            });

            if (!response.ok) throw new Error('Failed to record link click');
        } catch (err) {
            console.error('Error clicking link:', err);
        }
    };

    useEffect(() => {
        if (window.show_8876485) {
            setIsInitializing(false)
            return
        }

        const tag = document.createElement('script')
        tag.src = '//whephiwums.com/vignette.min.js'
        tag.dataset.zone = '8876485'
        tag.dataset.sdk = 'show_8876485'

        tag.onload = () => setIsInitializing(false)
        document.body.appendChild(tag)
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Top Navigation with Marquee */}
            <nav className="fixed top-0 left-0 right-0 z-50 gradient-flow shadow-lg border-b border-gray-700">
                <div className="relative py-1.5 sm:py-2 px-3 sm:px-4 overflow-hidden bg-black/30 backdrop-blur-sm">
                    <div className="flex whitespace-nowrap animate-marquee">
                        <span className="text-white font-bold text-xs sm:text-base mx-2 sm:mx-4 flex items-center">
                            <span className="inline-block animate-bounce mr-1.5 sm:mr-2 text-sm sm:text-base">🎉</span>
                            Welcome to my bot! Watch ads and earn rewards!
                        </span>
                        <span className="text-white font-bold text-xs sm:text-base mx-2 sm:mx-4 flex items-center">
                            <span className="inline-block animate-bounce mr-1.5 sm:mr-2 text-sm sm:text-base">🎉</span>
                            Welcome to my bot! Watch ads and earn rewards!
                        </span>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            {userState.loading || adState.loading ? (
                <Loading />
            ) : userState.error || adState.error ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
                    <div className="text-center p-6 bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-red-500/20">
                        <div className="text-red-400 text-lg mb-4">
                            {userState.error || adState.error}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            ) : (
                <main className="container mx-auto px-4 py-20 max-w-4xl">
                    <div className="bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white rgb-animate py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg text-center leading-tight">
                            Watch Ads & Earn Money
                        </h1>
                        <UserStats />

                        <DailyProgress
                            adsWatched={userState.adsWatched}
                            maxAds={1000}
                        />

                        <AdButtons
                            onWatchAd={handleWatchAd}
                            onAutoShowAds={handleAutoShowAds}
                            disabled={adState.loading}
                        />

                        <DirectLinks
                            links={directLinks.data}
                            onLinkClick={handleDirectLinkClick}
                        />
                    </div>
                </main>
            )}

            {/* Bottom Navigation */}
            <BottomNavigation
                onWithdraw={() => setIsWithdrawalModalOpen(true)}
                onTopEarners={() => setIsTopEarnersModalOpen(true)}
                onRules={() => setIsRulesModalOpen(true)}
                onAbout={() => setIsAboutModalOpen(true)}
                onSupport={() => setIsLiveSupportModalOpen(true)}
            />

            {/* Modals */}
            <WithdrawalModal
                isOpen={isWithdrawalModalOpen}
                onClose={() => setIsWithdrawalModalOpen(false)}
                balance={0}
                onHistoryClick={() => {
                    setIsWithdrawalModalOpen(false);
                    setIsHistoryModalOpen(true);
                }}
            />
            <WithdrawalHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
            />
            <TopEarnersModal
                isOpen={isTopEarnersModalOpen}
                onClose={() => setIsTopEarnersModalOpen(false)}
            />
            <RulesModal
                isOpen={isRulesModalOpen}
                onClose={() => setIsRulesModalOpen(false)}
            />
            <AboutModal
                isOpen={isAboutModalOpen}
                onClose={() => setIsAboutModalOpen(false)}
            />
            <LiveSupportModal
                isOpen={isLiveSupportModalOpen}
                onClose={() => setIsLiveSupportModalOpen(false)}
                userId={session?.user?.id || ''}
                userName={session?.user?.name || ''}
            />
        </div>
    );
}
