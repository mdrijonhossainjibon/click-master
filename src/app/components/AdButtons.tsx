'use client';
import { useState } from 'react';

interface AdButtonsProps {
    onWatchAd: () => void;
    disabled?: boolean;
}

export default function AdButtons({ onWatchAd, disabled }: AdButtonsProps) {
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [countdown, setCountdown] = useState(0);

    const handleWatchAd = () => {
        onWatchAd();
        setCountdown(23);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleAutoShowAds = async () => {
        if (isAutoPlaying) {
            // Stop auto play
            if (intervalId) clearInterval(intervalId);
            if (timeoutId) clearTimeout(timeoutId);
            setIntervalId(null);
            setTimeoutId(null);
            setIsAutoPlaying(false);
        } else {
            try {
                // Start auto play
                const newIntervalId = setInterval(onWatchAd, 15000);
                const newTimeoutId = setTimeout(() => {
                    clearInterval(newIntervalId);
                    setIntervalId(null);
                    setTimeoutId(null);
                    setIsAutoPlaying(false);
                }, 3600000);

                setIntervalId(newIntervalId);
                setTimeoutId(newTimeoutId);
                setIsAutoPlaying(true);
            } catch (err) {
                console.error('Error in auto show ads:', err);
                alert(err instanceof Error ? err.message : 'Failed to start auto show');
            }
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6 flex flex-col items-center">
            <button
                onClick={handleWatchAd}
                disabled={disabled || countdown > 0}
                className="w-full max-w-md h-16 sm:h-20 px-8 sm:px-10 text-white font-bold rounded-2xl shadow-[0_8px_30px_rgb(124,58,237,0.3)] hover:shadow-[0_8px_30px_rgb(124,58,237,0.5)] transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-800 hover:from-indigo-700 hover:to-purple-900 text-base sm:text-xl text-center flex items-center justify-center group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/40 to-purple-800/40 animate-pulse"></div>
                <div className="relative flex items-center">
                    <span className="text-2xl sm:text-3xl mr-3 group-hover:scale-110 transition-transform duration-300">
                        🎬
                    </span>
                    <span className="group-hover:scale-105 transition-transform duration-300">
                        {countdown > 0 ? `Wait ${countdown}s` : 'Watch Ads'}
                    </span>
                </div>
            </button>
            <button
              
                disabled={disabled}
                className={`auto-ads-btn w-full max-w-md h-16 sm:h-20 px-8 sm:px-10 text-white font-bold rounded-2xl transform hover:-translate-y-1 transition-all duration-300 text-base sm:text-xl text-center flex items-center justify-center group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
                    isAutoPlaying 
                    ? 'bg-gradient-to-r from-red-600 to-rose-800 hover:from-red-700 hover:to-rose-900 shadow-[0_8px_30px_rgb(225,29,72,0.3)] hover:shadow-[0_8px_30px_rgb(225,29,72,0.5)]'
                    : 'bg-gradient-to-r from-amber-600 to-orange-800 hover:from-amber-700 hover:to-orange-900 shadow-[0_8px_30px_rgb(245,158,11,0.3)] hover:shadow-[0_8px_30px_rgb(245,158,11,0.5)]'
                }`}
            >
                <div className={`absolute inset-0 w-full h-full animate-pulse ${
                    isAutoPlaying
                    ? 'bg-gradient-to-r from-red-600/40 to-rose-800/40'
                    : 'bg-gradient-to-r from-amber-600/40 to-orange-800/40'
                }`}></div>
                <div className="relative flex items-center">
                    <span className="text-2xl sm:text-3xl mr-3 group-hover:scale-110 transition-transform duration-300">
                        {isAutoPlaying ? '🛑' : '⚡'}
                    </span>
                    <span className="group-hover:scale-105 transition-transform duration-300">
                        {isAutoPlaying ? 'Stop Ads' : 'Auto Show Ads'}
                    </span>
                </div>
            </button>
        </div>
    );
}
