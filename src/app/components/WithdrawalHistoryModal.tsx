'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import WithdrawalDetailsModal from './WithdrawalDetailsModal';
import axios from 'axios';
 
import { API_CALL } from '@/lib/client';
 


interface WithdrawalHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    telegramId: string;
}

interface WithdrawalHistory {
    _id: string;
    createdAt: string;
    amount: number;
    method: string;
    status: 'pending' | 'approved' | 'rejected';
    recipient: string;
    userId: {
        name: string;
        email: string;
    };
}

export default function WithdrawalHistoryModal({ isOpen, onClose , telegramId}: WithdrawalHistoryModalProps) {
    const [isFullScreen, setIsFullScreen] = useState(true);
    const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [history, setHistory] = useState<WithdrawalHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchWithdrawals();
        }
    }, [isOpen]);

    const fetchWithdrawals = async () => {
        try {
            setIsLoading(true);
            const { response } = await  API_CALL({ url : 'withdrawals' , body : { telegramId  } }); 
            setHistory(response?.result   as any);
        } catch (error: any) {
           // toast.error(error.response?.data?.error || 'Failed to load withdrawals');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { response } = await API_CALL({ url:  'withdrawals', body: { id } , method : 'DELETE' });
            
            //toast.success('Withdrawal cancelled successfully');
            fetchWithdrawals();
        } catch (error: any) {
            //toast.error(error.response?.data?.error || 'Failed to cancel withdrawal');
        }
    };

    if (!isOpen) return null;

    const getStatusColor = (status: WithdrawalHistory['status']) => {
        switch (status) {
            case 'approved':
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
        switch (method.toLowerCase()) {
            case 'bkash':
                return '/images/BKash-Icon-Logo.wine.svg';
            case 'nagad':
                return '/images/BKash-Icon-Logo.wine.svg';
            case 'binance':
                return '/images/BKash-Icon-Logo.wine.svg';
            case 'bitget':
                return '/images/BKash-Icon-Logo.wine.svg';
            default:
                return '/images/BKash-Icon-Logo.wine.svg';
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
                    {isLoading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400">Loading withdrawals...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400">No withdrawal history found</p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item._id}
                                className="bg-gray-700/30 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-colors duration-200"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 relative cursor-pointer" onClick={() => setSelectedImage(getMethodIcon(item.method))}>
                                            <Image
                                                src={getMethodIcon(item.method)}
                                                alt={item.method}
                                                width={32}
                                                height={32}
                                                className="rounded-full hover:opacity-80 transition-opacity duration-200"
                                            />
                                            <Image
                                                src="/images/tether-usdt-logo.png"
                                                alt="USDT"
                                                width={16}
                                                height={16}
                                                className="absolute -bottom-1 -right-1 hover:opacity-80 transition-opacity duration-200"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedImage('/images/usdt.png');
                                                }}
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
                                                src="/images/tether-usdt-logo.png"
                                                alt="USDT"
                                                width={16}
                                                height={16}
                                            />
                                            <p className="text-white font-bold">${item.amount.toFixed(3)}</p>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className={`text-sm font-medium ${getStatusColor(item.status)} capitalize`}>
                                        {item.status}
                                    </span>
                                    <div className="flex items-center space-x-3">
                                        {item.status === 'pending' && (
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="text-xs text-red-400 hover:text-red-300 transition-colors duration-200"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => setSelectedWithdrawalId(item._id)}
                                            className="text-xs text-purple-400 hover:text-purple-300 transition-colors duration-200"
                                        >
                                            View Details
                                        </button>
                                    </div>
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
                                        src="/images/tether-usdt-logo.png"
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
                                        src="/images/tether-usdt-logo.png"
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
                                <p className="text-gray-400 text-sm">Approved</p>
                                <div className="flex items-center justify-center space-x-1">
                                    <Image
                                        src="/images/tether-usdt-logo.png"
                                        alt="USDT"
                                        width={16}
                                        height={16}
                                    />
                                    <p className="text-green-400 font-bold">
                                        ${history.filter(item => item.status === 'approved')
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
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] cursor-pointer"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                        <Image
                            src={selectedImage}
                            alt="Full screen preview"
                            width={800}
                            height={800}
                            className="object-contain max-w-full max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            className="absolute top-4 right-4 text-white bg-gray-800/50 hover:bg-gray-700 rounded-full p-2"
                            onClick={() => setSelectedImage(null)}
                        >
                            <span className="text-2xl">✕</span>
                        </button>
                    </div>
                </div>
            )}
            {selectedWithdrawalId && (
                <WithdrawalDetailsModal
                    isOpen={!!selectedWithdrawalId}
                    onClose={() => setSelectedWithdrawalId(null)}
                    withdrawalId={selectedWithdrawalId}
                />
            )}
        </div>
    );
}
