'use client';

import { useState } from 'react';

interface RulesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Rule {
    id: string;
    title: string;
    description: string;
    icon: string;
    importance: 'high' | 'medium' | 'low';
}

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
    const [isFullScreen, setIsFullScreen] = useState(true);
    
    const rules: Rule[] = [
        {
            id: '1',
            title: 'Watch Ads Properly',
            description: 'Watch each ad for the full duration. Skipping or using automation tools is strictly prohibited.',
            icon: '👀',
            importance: 'high'
        },
        {
            id: '2',
            title: 'One Account Per User',
            description: 'Multiple accounts are not allowed. Each user must have only one account linked to their Telegram ID.',
            icon: '👤',
            importance: 'high'
        },
        {
            id: '3',
            title: 'Minimum Withdrawal',
            description: 'Minimum withdrawal amount is $0.50 (৳50). Withdrawals are processed within 24-48 hours.',
            icon: '💰',
            importance: 'medium'
        },
        {
            id: '4',
            title: 'Payment Methods',
            description: 'We support bKash, Nagad, Binance USDT (BEP20), and Bitget USDT for withdrawals.',
            icon: '💳',
            importance: 'medium'
        },
        {
            id: '5',
            title: 'Verification',
            description: 'Your account must be verified with a valid Telegram ID before making any withdrawals.',
            icon: '✅',
            importance: 'high'
        }
    ];

    if (!isOpen) return null;

    const modalClasses = `fixed inset-0 bg-black bg-opacity-50 flex items-${isFullScreen ? 'start' : 'center'} justify-center z-50 ${isFullScreen ? 'p-0' : 'p-4'}`;
    const contentClasses = `bg-gray-800 rounded-${isFullScreen ? '0' : '2xl'} ${isFullScreen ? 'w-full h-full' : 'max-w-2xl w-full mx-4'} border border-gray-700 shadow-xl overflow-hidden transition-all duration-300`;

    const getImportanceColor = (importance: Rule['importance']) => {
        switch (importance) {
            case 'high':
                return 'text-red-400';
            case 'medium':
                return 'text-yellow-400';
            case 'low':
                return 'text-green-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className={modalClasses}>
            <div className={contentClasses}>
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <span className="mr-2">📜</span>
                            Platform Rules
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

                <div className={`${isFullScreen ? 'h-[calc(100vh-180px)] overflow-y-auto' : ''} p-6 space-y-4`}>
                    <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                        <p className="text-red-400 text-sm">
                            ⚠️ Violating these rules may result in account suspension or termination without prior notice.
                        </p>
                    </div>

                    {rules.map((rule) => (
                        <div
                            key={rule.id}
                            className="bg-gray-700/30 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="text-2xl pt-1">{rule.icon}</div>
                                <div>
                                    <h3 className="text-white font-semibold flex items-center">
                                        {rule.title}
                                        <span className={`ml-2 text-xs font-normal ${getImportanceColor(rule.importance)}`}>
                                            {rule.importance.toUpperCase()}
                                        </span>
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-1">{rule.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                        <p className="text-purple-400 text-sm">
                            💡 Following these rules ensures a fair and rewarding experience for all users.
                        </p>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
}
