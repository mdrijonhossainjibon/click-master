'use client';

interface DailyProgressProps {
    adsWatched: number;
    maxAds?: number;
}

export default function DailyProgress({ adsWatched, maxAds = 1000 }: DailyProgressProps) {
    const progress = Math.min((adsWatched / maxAds) * 100, 100);

    return (
        <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-400">Daily Progress</div>
                <div className="text-sm text-emerald-400">
                    {adsWatched}/{maxAds} Ads
                </div>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {adsWatched >= maxAds && (
                <div className="mt-2 text-center">
                    <div className="text-red-400 font-bold">Daily Limit Reached!</div>
                    <div className="text-sm text-gray-400">
                        Come back tomorrow for more earnings!
                    </div>
                </div>
            )}
        </div>
    );
}
