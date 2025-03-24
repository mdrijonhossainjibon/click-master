'use client';

import { useState } from 'react';
import Header from '../components/Header';

interface Transaction {
    id: string;
    type: 'withdrawal' | 'earning';
    amount: number;
    network?: string;
    walletAddress?: string;
    status: 'pending' | 'completed' | 'failed';
    timestamp: string;
    txHash?: string;
}

export default function HistoryPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: '1',
            type: 'withdrawal',
            amount: 5.000,
            network: 'Bitget USDT',
            walletAddress: '0x1234...5678',
            status: 'completed',
            timestamp: '2024-01-20 15:30:00',
            txHash: '0xabcd...ef12'
        },
        {
            id: '2',
            type: 'earning',
            amount: 0.005,
            status: 'completed',
            timestamp: '2024-01-20 15:25:00'
        }
    ]);
    const [filter, setFilter] = useState<'all' | 'withdrawal' | 'earning'>('all');

    const filteredTransactions = transactions.filter(tx => 
        filter === 'all' ? true : tx.type === filter
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-400/10 text-green-400';
            case 'pending': return 'bg-yellow-400/10 text-yellow-400';
            case 'failed': return 'bg-red-400/10 text-red-400';
            default: return 'bg-gray-400/10 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4">
            <div className="max-w-4xl mx-auto">
                <Header title="Transaction History" />
                
                <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-700 mb-4 sm:mb-6">
                    <div className="flex justify-center gap-1.5 sm:gap-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-200 ${filter === 'all' ? 'bg-purple-600 shadow-lg shadow-purple-600/20' : 'bg-gray-700/50 hover:bg-gray-600/70'}`}
                        >
                            All Transactions
                        </button>
                        <button
                            onClick={() => setFilter('withdrawal')}
                            className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-200 ${filter === 'withdrawal' ? 'bg-purple-600 shadow-lg shadow-purple-600/20' : 'bg-gray-700/50 hover:bg-gray-600/70'}`}
                        >
                            Withdrawals
                        </button>
                        <button
                            onClick={() => setFilter('earning')}
                            className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-200 ${filter === 'earning' ? 'bg-purple-600 shadow-lg shadow-purple-600/20' : 'bg-gray-700/50 hover:bg-gray-600/70'}`}
                        >
                            Earnings
                        </button>
                    </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    {filteredTransactions.map(transaction => (
                        <div key={transaction.id} className="bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/80 hover:border-purple-500/50 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4 sm:mb-5">
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${transaction.type === 'withdrawal' ? 'bg-red-400/10' : 'bg-green-400/10'}`}>
                                            <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${transaction.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                {transaction.type === 'withdrawal' ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                )}
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-sm sm:text-base font-medium text-gray-300 capitalize">{transaction.type}</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs sm:text-sm text-gray-400">{transaction.timestamp}</span>
                                                <span className={`text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full capitalize ${getStatusStyle(transaction.status)}`}>
                                                    {transaction.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-lg sm:text-2xl font-bold text-white">
                                        {transaction.type === 'withdrawal' ? '-' : '+'}
                                        ${transaction.amount.toFixed(3)}
                                    </div>
                                </div>
                            </div>
                            
                            {transaction.type === 'withdrawal' && (
                                <div className="mt-4 space-y-3 text-sm sm:text-base">
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                        <span className="font-medium">{transaction.network}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        <span className="font-medium break-all">{transaction.walletAddress}</span>
                                    </div>
                                    {transaction.txHash && (
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <span className="font-medium">{transaction.txHash}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredTransactions.length === 0 && (
                        <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-700 text-center">
                            <p className="text-sm sm:text-base text-gray-400">No transactions found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}