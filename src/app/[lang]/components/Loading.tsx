'use client';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm">
            <div className="relative">
                {/* Main spinner */}
                <div className="relative w-24 h-24">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-violet-500/20 animate-[spin_3s_linear_infinite]"></div>
                    
                    {/* Middle rotating ring */}
                    <div className="absolute inset-2 rounded-full border-[3px] border-violet-500/30 animate-[spin_2s_linear_infinite_reverse]"></div>
                    
                    {/* Inner rotating ring */}
                    <div className="absolute inset-4 rounded-full border-[3px] border-violet-500/40 animate-[spin_1s_linear_infinite]"></div>
                    
                    {/* Glowing center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-violet-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(139,92,246,0.7)]"></div>
                    </div>
                    
                    {/* Orbiting dots */}
                    <div className="absolute inset-0 animate-[spin_2s_linear_infinite]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                    </div>
                    <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-fuchsia-400 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.5)]"></div>
                    </div>
                </div>

                {/* Loading text with dots animation */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-1">
                    <div className="text-lg font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                        Loading
                    </div>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce"></div>
                    </div>
                </div>

                {/* Pulsing background rings */}
                <div className="absolute -inset-8 animate-ping-slow opacity-30">
                    <div className="absolute inset-0 rounded-full border-2 border-violet-500/20"></div>
                </div>
                <div className="absolute -inset-12 animate-ping-slow opacity-20 [animation-delay:-1s]">
                    <div className="absolute inset-0 rounded-full border-2 border-fuchsia-500/20"></div>
                </div>
            </div>
        </div>
    );
}
