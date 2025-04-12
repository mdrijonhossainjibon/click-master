'use client';

import { RootState } from "@/modules/store";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import crypto from 'crypto';

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ReferralHistory {
    id: string;
    username: string;
    joinedAt: string;
    earnings: number;
}

interface UserWithReferral {
    telegramId?: number;
    username?: string;
    referralCount?: number;
    referralEarnings?: number;
}

export default function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
    const { user } = useSelector((state: RootState) => state.public.auth);
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
    const [referralHistory, setReferralHistory] = useState<ReferralHistory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [referralCode, setReferralCode] = useState<string>('');

    // Generate a random referral code
    useEffect(() => {
        const generateRandomCode = (): string => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 6; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return code;
        };
        
        setReferralCode(generateRandomCode());
    }, []);

    // Create referral link using the Telegram Mini App URL scheme
    const referralLink = referralCode 
        ? `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}?start=ref_${referralCode}`
        : `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}`;

    // Function to handle incoming referral code from start_param
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const tg = (window as any).Telegram?.WebApp;
        if (!tg?.initDataUnsafe?.start_param) return;

        const startParam = tg.initDataUnsafe.start_param;
        if (startParam.startsWith('ref_')) {
            const incomingReferralCode = startParam.replace('ref_', '');
            // Handle the referral code here
            console.log('Incoming referral code:', incomingReferralCode);
        }
    }, []);

    // Simulated referral history data
    useEffect(() => {
        // In a real app, this would be fetched from an API
        const mockHistory: ReferralHistory[] = [
            { id: '1', username: 'user123', joinedAt: '2023-05-15', earnings: 5.20 },
            { id: '2', username: 'john_doe', joinedAt: '2023-06-02', earnings: 3.75 },
            { id: '3', username: 'alice_smith', joinedAt: '2023-06-18', earnings: 8.40 },
        ];
        setReferralHistory(mockHistory);
    }, []);

    // Generate a hash from the user's telegramId
    const generateHash = (telegramId: number | undefined): string => {
        if (!telegramId) return '';
        const hash = crypto.createHash('md5').update(telegramId.toString()).digest('hex');
        return hash.substring(0, 8); // Use first 8 characters for a shorter hash
    };

     const referralBonus = 10; // 10% bonus

    const copyToClipboard = async (text: string, type: 'link' | 'code') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success(type === 'link' ? t('referral.linkCopied') : t('referral.codeCopied'));
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error(type === 'link' ? t('referral.copyFailed') : t('referral.codeCopyFailed'));
        }
    };

    const shareToSocial = (platform: 'telegram' | 'whatsapp' | 'twitter') => {
        let url = '';
        const text = t('referral.shareText', { link: referralLink });
        
        switch (platform) {
            case 'telegram':
                url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + referralLink)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`;
                break;
        }
        
        if (typeof window !== 'undefined') {
            window.open(url, '_blank');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 md:bg-black/50 md:backdrop-blur-sm md:p-4 md:flex md:items-center md:justify-center">
            <div className="relative h-full md:h-auto w-full md:max-w-md md:rounded-2xl md:border md:border-gray-800 bg-gray-900 shadow-xl overflow-hidden">
                {/* Header - Telegram Mini App style */}
                <div className="sticky top-0 z-10 p-4 border-b border-gray-800 bg-gradient-to-r from-blue-500 to-blue-600">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{t('referral.title')}</h2>
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/80 hover:text-white transition-all hover:bg-black/30 active:scale-95"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Tabs - Telegram Mini App style */}
                <div className="flex border-b border-gray-800">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-3 text-center font-medium transition-colors ${
                            activeTab === 'overview' 
                                ? 'text-white border-b-2 border-blue-500' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {t('referral.overview')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 text-center font-medium transition-colors ${
                            activeTab === 'history' 
                                ? 'text-white border-b-2 border-blue-500' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {t('referral.history')}
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)] md:max-h-[70vh]">
                    {activeTab === 'overview' ? (
                        <>
                            {/* Referral Stats - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-400">{t('referral.totalReferrals')}</div>
                                        <div className="text-lg font-bold text-white">
                                            {(user as UserWithReferral)?.referralCount || 0}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">{t('referral.totalEarned')}</div>
                                        <div className="text-lg font-bold text-white">
                                            ${((user as UserWithReferral)?.referralEarnings || 0).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Referral Code - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('referral.yourCode')}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-700/50 text-white px-3 py-2 rounded-lg text-sm font-mono text-center">
                                        {referralCode}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(referralCode, 'code')}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95"
                                    >
                                        {copied ? t('referral.copied') : t('referral.copy')}
                                    </button>
                                </div>
                            </div>

                            {/* Referral Link - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('referral.yourLink')}</h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={referralLink}
                                        readOnly
                                        className="flex-1 bg-gray-700/50 text-white px-3 py-2 rounded-lg text-sm"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(referralLink, 'link')}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95"
                                    >
                                        {copied ? t('referral.copied') : t('referral.copy')}
                                    </button>
                                </div>
                            </div>

                            {/* Share Buttons - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('referral.share')}</h3>
                                <div className="flex justify-center gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => shareToSocial('telegram')}
                                        className="w-12 h-12 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.97 9.335c-.146.658-.537.818-1.084.51l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.534-.196 1.006.128.832.941z"/>
                                        </svg>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => shareToSocial('whatsapp')}
                                        className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.508 16.255c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.828z"/>
                                        </svg>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => shareToSocial('twitter')}
                                        className="w-12 h-12 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l.01.475c0 4.85-3.692 10.43-10.43 10.43-1.984 0-3.83-.58-5.35-1.574.275.032.542.048.824.048 1.61 0 3.092-.548 4.27-1.47-1.504-.028-2.774-1.02-3.21-2.38.21.036.42.06.645.06.312 0 .614-.042.9-.116-1.53-1.574-.028-2.774-1.704-2.758-3.37v-.042c.464.258.995.42 1.56.43-.922-.616-1.53-1.666-1.53-2.855 0-.63.17-1.22.466-1.74 1.695 2.08 4.23 3.446 7.087 3.59-.06-.252-.09-.516-.09-.783 0-1.9 1.54-3.44 3.44-3.44.99 0 1.885.42 2.513 1.09.784-.154 1.52-.44 2.184-.834-.258.805-.805 1.48-1.518 1.79z"/>
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>

                            {/* How it works - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('referral.howItWorks')}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
                                            1
                                        </div>
                                        <div>
                                            <div className="text-sm text-white">{t('referral.step1')}</div>
                                            <div className="text-xs text-gray-400">{t('referral.step1Desc')}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
                                            2
                                        </div>
                                        <div>
                                            <div className="text-sm text-white">{t('referral.step2')}</div>
                                            <div className="text-xs text-gray-400">{t('referral.step2Desc', { bonus: referralBonus })}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
                                            3
                                        </div>
                                        <div>
                                            <div className="text-sm text-white">{t('referral.step3')}</div>
                                            <div className="text-xs text-gray-400">{t('referral.step3Desc')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Referral History - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('referral.recentReferrals')}</h3>
                                
                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : referralHistory.length > 0 ? (
                                    <div className="space-y-3">
                                        {referralHistory.map((referral) => (
                                            <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                                                        {referral.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-medium">@{referral.username}</div>
                                                        <div className="text-xs text-gray-400">{new Date(referral.joinedAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-white font-medium">${referral.earnings.toFixed(2)}</div>
                                                    <div className="text-xs text-green-400">{t('referral.earned')}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        {t('referral.noReferrals')}
                                    </div>
                                )}
                            </div>
                            
                            {/* Referral Chart - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('referral.earningsChart')}</h3>
                                <div className="h-40 flex items-end justify-between gap-1">
                                    {[5, 8, 3, 12, 7, 4, 9].map((value, index) => (
                                        <div key={index} className="flex-1 flex flex-col items-center">
                                            <div 
                                                className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-md"
                                                style={{ height: `${(value / 12) * 100}%` }}
                                            ></div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 