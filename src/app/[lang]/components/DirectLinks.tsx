'use client';

import { Empty, message } from "antd";
import { motion } from "framer-motion";
 
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo, useCallback } from "react";
import { RootState } from "@/modules/store";
 

interface DirectLink {
    _id: string;
    title: string;
    url: string;
    icon: string;
    
}

interface ButtonState {
    [key: string]: {
        isLocked: boolean;
        countdown: number;
        lastUpdated: number;
        clickTimestamp: number;
    };
}

const STORAGE_KEY = 'directLinksButtonStates';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

// RGB Animation keyframes
const rgbAnimation = `
@keyframes rgbBorder {
    0% { border-color: rgb(255, 0, 0); box-shadow: 0 0 15px rgba(255, 0, 0, 0.5); }
    33% { border-color: rgb(0, 255, 0); box-shadow: 0 0 15px rgba(0, 255, 0, 0.5); }
    66% { border-color: rgb(0, 0, 255); box-shadow: 0 0 15px rgba(0, 0, 255, 0.5); }
    100% { border-color: rgb(255, 0, 0); box-shadow: 0 0 15px rgba(255, 0, 0, 0.5); }
}
@keyframes rgbText {
    0% { color: rgb(255, 0, 0); }
    33% { color: rgb(0, 255, 0); }
    66% { color: rgb(0, 0, 255); }
    100% { color: rgb(255, 0, 0); }
}
.rgb-border-animation {
    animation: rgbBorder 4s linear infinite;
    border: 2px solid;
}
.rgb-text-animation {
    animation: rgbText 4s linear infinite;
}
`;

export default function DirectLinks( ) {
    const links = useSelector((state: RootState) => state.public.directLinks?.items || []);
    const user = useSelector((state: RootState) => state.public.auth.user);
    const isAuthenticated = useSelector((state: RootState) => state.public.auth.isAuthenticated);

    // Initialize button states from localStorage
    const [buttonStates, setButtonStates] = useState<ButtonState>({});

    const  adsWatched     =user?.adsWatched || 0;

    // Add RGB animation styles
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = rgbAnimation;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Function to generate a hash based on linkId and timestamp
    const generateHash = (linkId: string, timestamp: number) => {
        const str = `${linkId}_${timestamp}_${process.env.NEXT_PUBLIC_HASH_SECRET || 'secret'}`;
        return btoa(str).replace(/[^a-zA-Z0-9]/g, '');
    };

    const handleDirectLinkClick = useCallback(async (link: DirectLink) => {
        try {
            // Check if button is already locked
            if (buttonStates[link._id]?.isLocked) {
                message.warning('Please wait for the countdown to finish');
                return;
            }

            const clickTime = Date.now();
            setButtonStates(prev => ({
                ...prev,
                [link._id]: {
                    isLocked: true,
                    countdown: 30,
                    lastUpdated: Date.now(),
                    clickTimestamp: clickTime
                }
            }));

            window.open(link.url, '_blank');
        } catch (error) {
            console.error('Error clicking link:', error);
            message.error('Failed to open link. Please try again.');
            setButtonStates(prev => {
                const newState = { ...prev };
                delete newState[link._id];
                return newState;
            });
        }
    }, [buttonStates]);

    // Function to handle API call when countdown finishes
    const handleCountdownFinish = useCallback(async (linkId: string) => {
        try {
            const buttonState = buttonStates[linkId];
            if (!isAuthenticated || !user?.id) {
                message.error('Please login with Telegram first');
                return;
            }
            if (!buttonState?.clickTimestamp) {
                throw new Error('Invalid click timestamp');
            }

            const timestamp = buttonState.clickTimestamp;

            const response = await fetch('/api/links/click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    linkId,
                    userId: user.id,
                    clickTimestamp: buttonState.clickTimestamp,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to record link click');
            }

            const data = await response.json();
            if (data.status === 'success') {
                message.success('Reward credited successfully!');
            }
        } catch (error) {
            console.error('Error recording link click:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to credit reward';
            message.error(errorMessage);
        }
    }, [isAuthenticated, user]);

    // Consolidated countdown timer effect
    useEffect(() => {
        const intervals: { [key: string]: NodeJS.Timeout } = {};

        Object.entries(buttonStates).forEach(([linkId, state]) => {
            if (state.isLocked && state.countdown > 0) {
                intervals[linkId] = setInterval(() => {
                    setButtonStates(prev => {
                        const newState = { ...prev };
                        if (newState[linkId].countdown <= 1) {
                            const clickTimestamp = newState[linkId].clickTimestamp;
                            delete newState[linkId];
                            // Make API call when countdown finishes
                            handleCountdownFinish(linkId);
                            return newState;
                        }
                        newState[linkId] = {
                            ...newState[linkId],
                            countdown: newState[linkId].countdown - 1
                        };
                        return newState;
                    });
                }, 1000);
            }
        });

        return () => {
            Object.values(intervals).forEach(interval => clearInterval(interval));
        };
    }, [buttonStates]);

    const linkButtons = useMemo(() => {
        return links.map(link => {
            const buttonState = buttonStates[link._id];
            const isLocked = buttonState?.isLocked;
            const countdown = buttonState?.countdown || 0;

            return (
                <motion.button
                    key={link._id}
                    variants={item}
                    onClick={() => handleDirectLinkClick(link)}
                    disabled={isLocked || adsWatched >= 1000}
                    className={`group relative flex items-center justify-center w-full h-16 rounded-xl shadow-lg overflow-hidden transition-all duration-300 
                        ${isLocked ? 'opacity-75 cursor-not-allowed' : 'rgb-border-animation hover:scale-105 hover:shadow-2xl'}`}
                    style={{
                        background: `linear-gradient(to right, var(--tw-gradient-from- , var(--tw-gradient-to- ))`
                    }}
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <div className="flex flex-col items-center justify-center relative z-10">
                        {isLocked ? (
                            <div className="flex items-center justify-center">
                                <span className="text-2xl text-amber-400 font-bold animate-pulse">
                                    {countdown}s
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <span className={`text-2xl transition-transform group-hover:scale-110 rgb-text-animation`}>
                                    {link.icon}
                                </span>
                                <span className="text-sm sm:text-base font-bold text-white group-hover:text-opacity-90">
                                    {link.title}
                                </span>
                            </div>
                        )}
                    </div>
                </motion.button>
            );
        });
    }, [links, buttonStates, handleDirectLinkClick, adsWatched]);

    return (
        <div className="w-full max-w-4xl mx-auto mb-6 p-6 bg-gradient-to-r from-red-900/50 to-pink-900/50 rounded-2xl border border-red-500/20 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col items-center space-y-4">
                <div className="text-center space-y-2 mb-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
                        Are you over 18 years old?
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        The following links contain adult content. Please confirm you are
                        over 18 years old to continue.
                    </p>
                </div>

                {links.length === 0 ? (
                    <div className="w-full py-8">
                        <Empty
                            description={
                                <span className="text-gray-400">No links available</span>
                            }
                            className="text-gray-400"
                        />
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full my-6"
                    >
                        {linkButtons}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full max-w-lg mx-auto"
                >
                    <p className="text-white py-4 px-6 rounded-xl shadow-lg bg-gradient-to-r from-amber-600 to-orange-800 text-sm sm:text-base text-center font-medium">
                        🎯 Watch the complete ad to receive your reward
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
