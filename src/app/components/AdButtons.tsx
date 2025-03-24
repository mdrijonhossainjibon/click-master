'use client';

interface AdButtonsProps {
    onWatchAd: () => void;
    onAutoShowAds: () => void;
    disabled?: boolean;
}

export default function AdButtons({ onWatchAd, onAutoShowAds, disabled }: AdButtonsProps) {
    return (
        <div className="space-y-4 sm:space-y-6 flex flex-col items-center">
            <button
                onClick={onWatchAd}
                disabled={disabled}
                className="w-full max-w-md h-16 sm:h-20 px-8 sm:px-10 text-white font-bold rounded-2xl shadow-[0_8px_30px_rgb(124,58,237,0.3)] hover:shadow-[0_8px_30px_rgb(124,58,237,0.5)] transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-800 hover:from-indigo-700 hover:to-purple-900 text-base sm:text-xl text-center flex items-center justify-center group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/40 to-purple-800/40 animate-pulse"></div>
                <div className="relative flex items-center">
                    <span className="text-2xl sm:text-3xl mr-3 group-hover:scale-110 transition-transform duration-300">
                        🎬
                    </span>
                    <span className="group-hover:scale-105 transition-transform duration-300">
                        Watch Ads
                    </span>
                </div>
            </button>
            <button
                onClick={onAutoShowAds}
                disabled={disabled}
                className="auto-ads-btn w-full max-w-md h-16 sm:h-20 px-8 sm:px-10 text-white font-bold rounded-2xl shadow-[0_8px_30px_rgb(245,158,11,0.3)] hover:shadow-[0_8px_30px_rgb(245,158,11,0.5)] transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-amber-600 to-orange-800 hover:from-amber-700 hover:to-orange-900 text-base sm:text-xl text-center flex items-center justify-center group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-600/40 to-orange-800/40 animate-pulse"></div>
                <div className="relative flex items-center">
                    <span className="text-2xl sm:text-3xl mr-3 group-hover:scale-110 transition-transform duration-300">
                        ⚡
                    </span>
                    <span className="group-hover:scale-105 transition-transform duration-300">
                        Auto Show Ads
                    </span>
                </div>
            </button>
        </div>
    );
}
