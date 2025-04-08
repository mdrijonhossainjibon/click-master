'use client';

import { RootState } from "@/modules/store";
import { signOut } from "next-auth/react";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchWithdrawalHistory, fetchWithdrawalTiming } from "@/modules/public/withdrawal/withdrawalActions";
import { WithdrawalHistory } from "@/modules/public/withdrawal/types";
import { useTranslation } from "react-i18next";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    
}

 

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {

    const { user } = useSelector((state: RootState) => state.public.auth);
    const { withdrawalHistory, timing, loading } = useSelector((state: RootState) => state.public.withdrawal);
    const achievements : any[] = useSelector((state: RootState) => state.public.achievement.achievements);

    const dispatch = useDispatch();
   const { t } = useTranslation();

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchWithdrawalHistory());
            dispatch(fetchWithdrawalTiming());
        }
    }, [isOpen, dispatch]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 md:bg-black/50 md:backdrop-blur-sm md:p-4 md:flex md:items-center md:justify-center">
            <div className="relative h-full md:h-auto w-full md:max-w-sm md:rounded-2xl md:border md:border-gray-800 bg-gray-900 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 p-4 border-b border-gray-800 bg-gradient-to-r from-purple-500 to-indigo-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{ t('profile') }</h2>
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/80 hover:text-white transition-all hover:bg-black/30 active:scale-95"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                {/* Logout Button */}
                <button
                    onClick={ ()=> signOut()}
                    className="w-full py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium transition-all active:scale-[0.98]"
                >
                    {t('logout')}
                </button>

                {/* Join Date */}
                {/* Profile Content */}
                <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] md:max-h-[80vh]">
                    {/* Avatar and Balance */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg ring-4 ring-purple-400/20">
                            <span className="text-2xl">👤</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm text-gray-400">{ user?.fullName }</div>
                            <div className="text-xl font-bold text-white">${user?.balance.toFixed(2)}</div>
                            <div className="text-xs text-gray-500 mt-1">{ t('telegramId')}: { user?.telegramId }</div>
                        </div>
                    </div>

                    {/* Level and Rank */}
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <div className="text-sm text-gray-400">{ t('level') }</div>
                                <div className="text-lg font-bold text-white">Level {user?.level || 1}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-400">{  t('rank') }</div>
                                <div className="text-lg font-bold text-white">{user?.rank || 'Beginner'}</div>
                            </div>
                        </div>
                        {/* Progress bar */}
                        <div className="h-2 bg-gray-700/50 rounded-full mt-2 overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" 
                                style={{ width: `${((user?.adsWatched || 0) % 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 rounded-xl p-3">
                            <div className="text-sm text-gray-400">{  t('totalEarned')}</div>
                            <div className="text-lg font-bold text-white">${user?.balance.toFixed(2)}</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-3">
                            <div className="text-sm text-gray-400">{  t('adsWatched')}</div>
                            <div className="text-lg font-bold text-white">{user?.adsWatched}</div>
                        </div>
                    </div>

                    {/* Withdrawal Info */}
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <h3 className="text-lg font-semibold text-white mb-3">{  t('withdrawHistory')}</h3>
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-gray-400">{  t('lastWithdrawal')}</div>
                            <div className="text-sm text-white">{timing?.lastWithdrawal ? new Date(timing.lastWithdrawal).toLocaleDateString() : '-'}</div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-400">{  t('nextWithdrawal')}</div>
                            <div className="text-sm text-white">{timing?.nextWithdrawal ? new Date(timing.nextWithdrawal).toLocaleDateString() : '-'}</div>
                        </div>
                        {/* Recent withdrawals */}
                        {withdrawalHistory.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {withdrawalHistory.slice(0, 3).map((withdrawal: WithdrawalHistory, index: number) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <div className="text-gray-400">{new Date(withdrawal.createdAt).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white">${withdrawal.amount.toFixed(2)}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                withdrawal.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                                withdrawal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                                {withdrawal.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Achievements */}
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <h3 className="text-lg font-semibold text-white mb-3">{  t('achievements')}</h3>
                        <div className="space-y-3">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        achievement.completed ? 
                                        'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 
                                        'bg-gray-700/50 text-gray-400'
                                    }`}>
                                        {achievement.completed ? '✓' : '○'}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{achievement.name}</div>
                                        <div className="text-xs text-gray-400">{achievement.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                        {  t('joinDate')}:  {user?.createdAt}
                    </div>
                </div>
            </div>
        </div>
    );
}
