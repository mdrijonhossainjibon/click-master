'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
}

interface Stat {
    label: string;
    value: string;
    icon: string;
}

interface AboutData {
    features: Feature[];
    stats: Stat[];
    platformInfo: {
        title: string;
        description: string;
        bannerImage: string;
        ctaTitle: string;
        ctaDescription: string;
    };
    contact: {
        telegram: string;
        email: string;
    };
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
    const [isFullScreen, setIsFullScreen] = useState(true);
    const [aboutData, setAboutData] = useState<AboutData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await fetch('/api/about');
                if (!response.ok) {
                    throw new Error('Failed to fetch about data');
                }

                const result = await response.json();
                if (result.success) {
                    setAboutData(result.data);
                }
            } catch (error) {
                console.error('Error fetching about data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchAboutData();
        }
    }, [isOpen]);

    if (!isOpen || !aboutData) return null;

    const modalClasses = `fixed inset-0 bg-black bg-opacity-50 flex items-${isFullScreen ? 'start' : 'center'} justify-center z-50 ${isFullScreen ? 'p-0' : 'p-4'}`;
    const contentClasses = `bg-gray-800 rounded-${isFullScreen ? '0' : '2xl'} ${isFullScreen ? 'w-full h-full' : 'max-w-2xl w-full mx-4'} border border-gray-700 shadow-xl overflow-hidden transition-all duration-300`;

    return (
        <div className={modalClasses}>
            <div className={contentClasses}>
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <span className="mr-2">ℹ️</span>
                            About ClickMasterAds
                        </h2>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsFullScreen(!isFullScreen)}
                                className="p-2 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                            >
                                <span className="text-gray-400 hover:text-white text-xl">
                                    {isFullScreen ? '⊙' : '⤢'}
                                </span>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                            >
                                <span className="text-gray-400 hover:text-white">✕</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`${isFullScreen ? 'h-[calc(100vh-180px)] overflow-y-auto' : ''} p-6 space-y-6`}>
                    <div className="relative h-40 rounded-xl overflow-hidden">
                        <Image
                            src={aboutData.platformInfo.bannerImage}
                            alt="ClickMasterAds Platform"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-white">{aboutData.platformInfo.title}</h1>
                        <p className="text-gray-400">{aboutData.platformInfo.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {aboutData.stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-gray-700/30 rounded-xl p-4 text-center border border-gray-700/50"
                            >
                                <div className="text-2xl mb-2">{stat.icon}</div>
                                <p className="text-white font-bold">{stat.value}</p>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {aboutData.features.map((feature) => (
                            <div
                                key={feature.id}
                                className="bg-gray-700/30 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="text-2xl pt-1">{feature.icon}</div>
                                    <div>
                                        <h3 className="text-white font-semibold">{feature.title}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 text-center border border-purple-500/20">
                        <h3 className="text-white font-bold mb-2">{aboutData.platformInfo.ctaTitle}</h3>
                        <p className="text-gray-300 text-sm">{aboutData.platformInfo.ctaDescription}</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-white font-semibold">Contact & Support</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <a
                                href={aboutData.contact.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl p-3 transition-colors duration-200"
                            >
                                <span>📱</span>
                                <span className="text-blue-400">Telegram</span>
                            </a>
                            <a
                                href={`mailto:${aboutData.contact.email}`}
                                className="flex items-center justify-center space-x-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl p-3 transition-colors duration-200"
                            >
                                <span>✉️</span>
                                <span className="text-purple-400">Email</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
