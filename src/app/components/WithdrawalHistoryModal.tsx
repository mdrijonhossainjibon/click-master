'use client';

import { useState } from 'react';
import Image from 'next/image';

interface WithdrawalHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface WithdrawalHistory {
    id: string;
    date: string;
    amount: number;
    method: string;
    status: 'pending' | 'completed' | 'rejected';
    recipient: string;
}

export default function WithdrawalHistoryModal({ isOpen, onClose }: WithdrawalHistoryModalProps) {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [history] = useState<WithdrawalHistory[]>([
        {
            id: '1',
            date: '2025-03-23',
            amount: 100,
            method: 'bkash',
            status: 'completed',
            recipient: '01712345678'
        },
        {
            id: '2',
            date: '2025-03-22',
            amount: 50,
            method: 'nagad',
            status: 'pending',
            recipient: '01812345678'
        },
        {
            id: '3',
            date: '2025-03-21',
            amount: 200,
            method: 'binance',
            status: 'rejected',
            recipient: '0x1234...5678'
        }
    ]);

    if (!isOpen) return null;

    const getStatusColor = (status: WithdrawalHistory['status']) => {
        switch (status) {
            case 'completed':
                return 'text-green-400';
            case 'pending':
                return 'text-yellow-400';
            case 'rejected':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'bkash':
                return '/images/bkash.png';
            case 'nagad':
                return '/images/nagad.png';
            case 'binance':
                return '/images/binance.png';
            case 'bitget':
                return '/images/bitget.png';
            default:
                return '/images/usdt.png';
        }
    };

    const modalClasses = `fixed inset-0 bg-black bg-opacity-50 flex items-${isFullScreen ? 'start' : 'center'} justify-center z-50 ${isFullScreen ? 'p-0' : 'p-4'}`;
    const contentClasses = `bg-gray-800 rounded-${isFullScreen ? '0' : '2xl'} ${isFullScreen ? 'w-full h-full' : 'max-w-md w-full mx-4'} border border-gray-700 shadow-xl overflow-hidden transition-all duration-300`;

    return (
        <div className={modalClasses}>
            <div className={contentClasses}>
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Withdrawal History</h2>
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

                <div className={`${isFullScreen ? 'h-[calc(100vh-180px)] overflow-y-auto' : ''} p-6 space-y-4`}>
                    {history.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400">No withdrawal history found</p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="bg-gray-700/30 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-colors duration-200"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 relative">
                                            <Image
                                                src={getMethodIcon(item.method)}
                                                alt={item.method}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                            <Image
                                                src="/images/usdt.png"
                                                alt="USDT"
                                                width={16}
                                                height={16}
                                                className="absolute -bottom-1 -right-1"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">
                                                {item.method.charAt(0).toUpperCase() + item.method.slice(1)}
                                            </h3>
                                            <p className="text-gray-400 text-sm">{item.recipient}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <Image
                                                src="/images/usdt.png"
                                                alt="USDT"
                                                width={16}
                                                height={16}
                                            />
                                            <p className="text-white font-bold">${item.amount.toFixed(3)}</p>
                                        </div>
                                        <p className="text-sm text-gray-400">{item.date}</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className={`text-sm font-medium ${getStatusColor(item.status)} capitalize`}>
                                        {item.status}
                                    </span>
                                    <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors duration-200">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 space-y-4">
                    <div className="bg-gray-700/30 rounded-xl p-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">Total</p>
                                <div className="flex items-center justify-center space-x-1">
                                    <Image
                                        src="/images/usdt.png"
                                        alt="USDT"
                                        width={16}
                                        height={16}
                                    />
                                    <p className="text-white font-bold">
                                        ${history.reduce((sum, item) => sum + item.amount, 0).toFixed(3)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">Pending</p>
                                <div className="flex items-center justify-center space-x-1">
                                    <Image
                                        src="/images/usdt.png"
                                        alt="USDT"
                                        width={16}
                                        height={16}
                                    />
                                    <p className="text-yellow-400 font-bold">
                                        ${history.filter(item => item.status === 'pending')
                                            .reduce((sum, item) => sum + item.amount, 0).toFixed(3)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">Completed</p>
                                <div className="flex items-center justify-center space-x-1">
                                    <Image
                                        src="/images/usdt.png"
                                        alt="USDT"
                                        width={16}
                                        height={16}
                                    />
                                    <p className="text-green-400 font-bold">
                                        ${history.filter(item => item.status === 'completed')
                                            .reduce((sum, item) => sum + item.amount, 0).toFixed(3)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

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
