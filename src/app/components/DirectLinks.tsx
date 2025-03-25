'use client';

import { Empty, message } from "antd";
import { motion } from "framer-motion";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo, useCallback } from "react";

interface DirectLink {
    _id: string;
    title: string;
    url: string;
    icon: string;
    gradient: {
        from: string;
        to: string;
    };
}

interface ButtonState {
    [key: string]: {
        isLocked: boolean;
        countdown: number;
        lastUpdated: number;
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

export default function DirectLinks() {
    const userState = useSelector((state: RootState) => state.userStats.userState); 
    const links = userState?.directLinks || [];
    
    // Initialize button states from localStorage
    const [buttonStates, setButtonStates] = useState<ButtonState>(() => {
        if (typeof window === 'undefined') return {};
        
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return {};

        const parsed = JSON.parse(saved);
        const now = Date.now();
        
        // Clean up expired states and update countdowns
        const updated: ButtonState = {};
        Object.entries(parsed).forEach(([id, state]: [string, any]) => {
            const elapsed = Math.floor((now - state.lastUpdated) / 1000);
            const remaining = Math.max(0, state.countdown - elapsed);
            
            if (remaining > 0) {
                updated[id] = {
                    isLocked: true,
                    countdown: remaining,
                    lastUpdated: now
                };
            }
        });
        
        return updated;
    });

    // Add RGB animation styles
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = rgbAnimation;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Persist button states to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(buttonStates));
    }, [buttonStates]);

    // Memoized countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            setButtonStates(prevStates => {
                const newStates = { ...prevStates };
                let hasUpdates = false;

                Object.keys(newStates).forEach(linkId => {
                    if (newStates[linkId].countdown > 0) {
                        newStates[linkId].countdown -= 1;
                        newStates[linkId].lastUpdated = Date.now();
                        hasUpdates = true;
                    }
                    if (newStates[linkId].countdown === 0) {
                        delete newStates[linkId];
                        hasUpdates = true;
                    }
                });

                return hasUpdates ? newStates : prevStates;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleDirectLinkClick = useCallback(async (link: DirectLink) => {
        if (buttonStates[link._id]?.isLocked) {
            message.warning('Please wait for the countdown to finish');
            return;
        }

        try {
            setButtonStates(prev => ({
                ...prev,
                [link._id]: {
                    isLocked: true,
                    countdown: 30,
                    lastUpdated: Date.now()
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
                    disabled={isLocked}
                    className={`group relative flex items-center justify-center w-full h-16 rounded-xl shadow-lg overflow-hidden transition-all duration-300 
                        ${isLocked ? 'opacity-75 cursor-not-allowed' : 'rgb-border-animation hover:scale-105 hover:shadow-2xl'}`}
                    style={{
                        background: `linear-gradient(to right, var(--tw-gradient-from-${link.gradient.from}), var(--tw-gradient-to-${link.gradient.to}))`
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
                    {isLocked && (
                        <div className="absolute -bottom-6 left-0 right-0 text-center">
                            <span className="text-amber-400 text-sm font-medium animate-pulse">
                                {countdown}s
                            </span>
                        </div>
                    )}
                </motion.button>
            );
        });
    }, [links, buttonStates, handleDirectLinkClick]);

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
