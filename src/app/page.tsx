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

interface Session {
    user?: {
        id?: string;
        name?: string;
        email?: string;
    };
}

export default function Home() {
    const { data: session } = useSession() as { data: Session | null };
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isTopEarnersModalOpen, setIsTopEarnersModalOpen] = useState(false);
    const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isLiveSupportModalOpen, setIsLiveSupportModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [directLinks, setDirectLinks] = useState<DirectLink[]>([]);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const response = await fetch('/api/users/stats');
                if (!response.ok) throw new Error('Failed to fetch user stats');
                
                const { data } = await response.json();
                if (data) {
                ///setUserStats(data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch user stats');
            } finally {
                setLoading(false);
            }
        };

        const fetchDirectLinks = async () => {
            try {
                const response = await fetch('/api/direct-links?category=adult');
                const { data } = await response.json();
                if (data) {
                    setDirectLinks(data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch direct links');
            }
        };

        fetchUserStats();
        fetchDirectLinks();
    }, []);

    const handleWatchAd = async () => {
        // TODO: Implement ad watching logic
    };

    const handleAutoShowAds = async () => {
        // TODO: Implement auto show ads logic
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
            {loading ? (
                <Loading />
            ) : error ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
                    <div className="text-center p-6 bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-red-500/20">
                        <div className="text-red-400 text-lg mb-4">{error}</div>
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
                            adsWatched={0} 
                        />

                        

                        <AdButtons 
                            onWatchAd={handleWatchAd}
                            onAutoShowAds={handleAutoShowAds}
                            disabled={false}
                        />

                        <DirectLinks 
                            links={directLinks}
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
