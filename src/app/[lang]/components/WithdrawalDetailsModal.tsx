'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi';
import { BiRefresh } from 'react-icons/bi';

interface WithdrawalDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    withdrawalId: string;
}

interface WithdrawalDetails {
    _id: string;
    userId: {
        name: string;
        email: string;
    };
    method: string;
    amount: number;
    recipient: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export default function WithdrawalDetailsModal({ isOpen, onClose, withdrawalId }: WithdrawalDetailsModalProps) {
    const [details, setDetails] = useState<WithdrawalDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && withdrawalId) {
            fetchWithdrawalDetails();
        }
    }, [isOpen, withdrawalId]);

    const fetchWithdrawalDetails = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await axios.get(`/api/withdrawals/${withdrawalId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch withdrawal details');
            }
            setDetails(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch withdrawal details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const handleUpdateStatus = async (newStatus: WithdrawalDetails['status']) => {
        try {
            setIsLoading(true);
            const response = await axios.put(`/api/withdrawals/${withdrawalId}`, {
                status: newStatus
            });
            if (response.status === 200) {
                setDetails(response.data);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteWithdrawal = async () => {
        if (!confirm('Are you sure you want to delete this withdrawal?')) return;
        
        try {
            setIsLoading(true);
            await axios.delete(`/api/withdrawals/${withdrawalId}`);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete withdrawal');
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const getMethodIcon = (method: string) => {
        const defaultIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6IiBmaWxsPSIjOUI5QjlCIi8+PC9zdmc+';
        
        switch (method.toLowerCase()) {
            case 'bkash':
                return 'https://play-lh.googleusercontent.com/1CRcUfmtwvWxT2g-xJF8s9_btha42TLi6Lo-qVkVomXBb_citzakZX9BbeY51iholWs=w240-h480-rw';
            case 'nagad':
                return '/images/nagad.png';
            case 'binance':
                return 'https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png';
            case 'bitget':
                return '/images/bitget.png';
            default:
                return defaultIcon;
        }
    };

    const getUSDTIcon = () => {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6IiBmaWxsPSIjMjZBMTdCIi8+PC9zdmc+';
    };

    const getPaymentLink = (method: string, recipient: string) => {
        switch (method.toLowerCase()) {
            case 'binance':
                return `https://www.binance.com/en/send-crypto/${recipient}`;
            case 'bitget':
                return `https://www.bitget.com/send/${recipient}`;
            default:
                return null;
        }
    };

    const modalClasses = `fixed inset-0 bg-black/90 backdrop-blur-lg flex items-${isFullScreen ? 'start' : 'center'} justify-center z-50`;
    const contentClasses = `bg-gray-800/80 backdrop-blur-xl ${isFullScreen ? 'w-full h-full rounded-none' : 'rounded-2xl max-w-2xl w-full mx-4'} border border-gray-700/50 shadow-2xl transition-all duration-300`;

    return (
        <div className={modalClasses}>
            <div className={contentClasses}>
                <div className="sticky top-0 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 p-6 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-2xl font-bold text-white">Withdrawal Details</h2>
                        <button
                            onClick={fetchWithdrawalDetails}
                            className="p-2 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                            disabled={isLoading}
                        >
                            <BiRefresh className={`text-gray-400 hover:text-white w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
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

                <div className={`${isFullScreen ? 'h-[calc(100vh-136px)] overflow-y-auto' : ''} p-6`}>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="text-red-400 text-5xl">⚠️</div>
                            <p className="text-red-400 text-lg">{error}</p>
                            <button
                                onClick={() => fetchWithdrawalDetails()}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors duration-200"
                            >
                                Retry
                            </button>
                        </div>
                    ) : details ? (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="bg-gray-700/30 rounded-xl p-6 space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 relative">
                                        <Image
                                            src={getMethodIcon(details.method)}
                                            alt={details.method}
                                            width={64}
                                            height={64}
                                            className="rounded-full ring-2 ring-purple-500/30"
                                            unoptimized={getMethodIcon(details.method).startsWith('data:')}
                                        />
                                        <Image
                                            src={getUSDTIcon()}
                                            alt="USDT"
                                            width={24}
                                            height={24}
                                            className="absolute -bottom-1 -right-1 ring-2 ring-purple-500/30 rounded-full"
                                            unoptimized
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-xl">
                                            {details.method.charAt(0).toUpperCase() + details.method.slice(1)}
                                        </h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                           
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-400 text-sm">
                                                {new Date(details.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-600/50">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-2">Amount</p>
                                        <div className="flex items-center space-x-2">
                                            <Image
                                                src={getUSDTIcon()}
                                                alt="USDT"
                                                width={24}
                                                height={24}
                                                unoptimized
                                            />
                                            <p className="text-white font-bold text-2xl">${details.amount.toFixed(3)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm mb-2">Recipient</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-white font-mono text-lg break-all">
                                                {details.recipient}
                                            </p>
                                            <button
                                                onClick={() => handleCopyToClipboard(details.recipient, 'recipient')}
                                                className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors duration-200"
                                            >
                                                {copiedField === 'recipient' ? (
                                                    <FiCheck className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <FiCopy className="w-4 h-4 text-gray-400 hover:text-white" />
                                                )}
                                            </button>
                                            {getPaymentLink(details.method, details.recipient) && (
                                                <a
                                                    href={getPaymentLink(details.method, details.recipient)!}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors duration-200"
                                                >
                                                    <FiExternalLink className="w-4 h-4 text-purple-400 hover:text-purple-300" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-700/30 rounded-xl p-6 space-y-6">
                                <div>
                                    <h4 className="text-white font-semibold mb-4">User Information</h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-gray-400 text-sm mb-1">Name</p>
                                            <p className="text-white">{details.userId.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm mb-1">Email</p>
                                            <div className="flex items-center space-x-2">
                                                <p className="text-white">{details.userId.email}</p>
                                                <button
                                                    onClick={() => handleCopyToClipboard(details.userId.email, 'email')}
                                                    className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors duration-200"
                                                >
                                                    {copiedField === 'email' ? (
                                                        <FiCheck className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <FiCopy className="w-4 h-4 text-gray-400 hover:text-white" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-600/50">
                                    <p className="text-gray-400 text-sm mb-1">Transaction ID</p>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-white font-mono break-all">{details._id}</p>
                                        <button
                                            onClick={() => handleCopyToClipboard(details._id, 'txid')}
                                            className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors duration-200"
                                        >
                                            {copiedField === 'txid' ? (
                                                <FiCheck className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <FiCopy className="w-4 h-4 text-gray-400 hover:text-white" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                          

                            {!isFullScreen && (
                                <button
                                    onClick={onClose}
                                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300"
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
