'use client';

///

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FiCopy, FiCheck, FiChevronDown, FiInfo, FiAlertTriangle, FiClock, FiShield, FiSmartphone, FiCheckCircle, FiXCircle, FiClock as FiClockCircle, FiX } from 'react-icons/fi';
import { API_CALL } from '@/lib/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { SiBitcoin, SiTether, SiBinance, SiEthereum, SiLitecoin, SiRipple, SiSolana } from 'react-icons/si';
import { FaCoins, FaMobileAlt } from 'react-icons/fa';
import { RootState } from "@/modules/store";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { withdrawalApi } from '@/modules/public/withdrawal/api';
import { WithdrawalHistory as IWithdrawalHistory } from '@/modules/public/withdrawal/types';

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Coin {
    id: string;
    symbol: string;
    name: string;
    icon: string;
    iconComponent?: React.ReactNode;
    networks: Network[];
}

interface Network {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    iconComponent?: React.ReactNode;
    fee: number;
    minWithdraw: number;
    maxWithdraw: number;
}

interface WithdrawalHistory {
    _id: string;
    userId: string;
    method: 'bkash' | 'nagad' | 'bitget' | 'binance';
    amount: number;
    originalAmount: number;
    recipient: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    currency: 'USDT' | 'BDT';
    network?: string;
    bdtAmount?: number;
}

// Utility function for getting method icon
const getMethodIcon = (method: string) => {
    switch (method) {
        case 'bkash':
        case 'nagad':
            return <FaMobileAlt className="w-5 h-5 text-[#E2136E]" />;
        case 'bitget':
        case 'binance':
            return <SiTether className="w-5 h-5 text-[#26A17B]" />;
        default:
            return <FaCoins className="w-5 h-5" />;
    }
};

// Status Legend Component
const StatusLegend = ({ t }: { t: any }) => (
    <div className="flex items-center gap-2">
        {[
            { status: 'completed', color: 'green' },
            { status: 'pending', color: 'yellow' },
            { status: 'rejected', color: 'red' }
        ].map(({ status, color }) => (
            <div key={status} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full bg-${color}-400`}></div>
                <span className="text-xs text-gray-400">{t(`withdrawal.status.${status}`)}</span>
            </div>
        ))}
    </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

// Empty State Component
const EmptyState = ({ t }: { t: any }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 text-gray-400 bg-gray-800/30 rounded-lg border border-gray-700/50"
    >
        <FiClock className="w-6 h-6 mx-auto mb-2 text-gray-500" />
        {t('withdrawal.noWithdrawals')}
    </motion.div>
);

// Withdrawal Item Component
const WithdrawalItem = ({ 
    withdrawal, 
    t, 
    copiedField, 
    onCopy 
}: { 
    withdrawal: WithdrawalHistory;
    t: any;
    copiedField: string | null;
    onCopy: (text: string, field: string) => void;
}) => (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
            withdrawal.status === 'approved' ? 'bg-green-400/5 border-green-400/10 hover:bg-green-400/10' :
            withdrawal.status === 'pending' ? 'bg-yellow-400/5 border-yellow-400/10 hover:bg-yellow-400/10' :
            'bg-red-400/5 border-red-400/10 hover:bg-red-400/10'
        }`}
    >
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                withdrawal.method === 'bkash' || withdrawal.method === 'nagad' ? 'bg-[#E2136E]/10' :
                withdrawal.method === 'bitget' || withdrawal.method === 'binance' ? 'bg-[#26A17B]/10' :
                'bg-blue-500/10'
            }`}>
                {getMethodIcon(withdrawal.method)}
            </div>
            <div>
                <div className="text-white font-medium flex items-center gap-2">
                    {withdrawal.currency === 'BDT' ? '৳' : '$'}{withdrawal.originalAmount.toFixed(2)}
                    {withdrawal.status === 'approved' && (
                        <FiCheckCircle className="w-4 h-4 text-green-400" />
                    )}
                </div>
                <div className="text-xs text-gray-400">
                    {new Date(withdrawal.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
        <div className="text-right">
            <div className={`text-sm font-medium ${
                withdrawal.status === 'approved' ? 'text-green-400' :
                withdrawal.status === 'pending' ? 'text-yellow-400' :
                'text-red-400'
            }`}>
                {t(`withdrawal.status.${withdrawal.status}`)}
            </div>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-400 flex items-center gap-1 mt-1"
            >
                <span className="truncate max-w-[100px]">{withdrawal.recipient}</span>
                <button
                    onClick={() => onCopy(withdrawal.recipient, 'recipient')}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title={t('withdrawal.copyAddress')}
                >
                    <AnimatePresence mode="wait">
                        {copiedField === 'recipient' ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <FiCheck className="w-3 h-3" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="copy"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <FiCopy className="w-3 h-3" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </motion.div>
        </div>
    </motion.div>
);

// Withdrawal History Component
const WithdrawalHistory = ({ 
    withdrawals,
    isLoading,
    t,
    copiedField,
    onCopy
}: {
    withdrawals: WithdrawalHistory[];
    isLoading: boolean;
    t: any;
    copiedField: string | null;
    onCopy: (text: string, field: string) => void;
}) => (
    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{t('withdrawal.recentWithdrawals')}</h3>
            <StatusLegend t={t} />
        </div>

        {isLoading ? (
            <LoadingSpinner />
        ) : withdrawals.length > 0 ? (
            <motion.div 
                className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            >
                <AnimatePresence>
                    {withdrawals.map((withdrawal) => (
                        <WithdrawalItem
                            key={withdrawal._id}
                            withdrawal={withdrawal}
                            t={t}
                            copiedField={copiedField}
                            onCopy={onCopy}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        ) : (
            <EmptyState t={t} />
        )}
    </div>
);

export default function WithdrawalModal({ isOpen, onClose }: WithdrawalModalProps) {
    const { user } = useSelector((state: RootState) => state.public.auth);
    const { t } = useTranslation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [withdrawals, setWithdrawals] = useState<WithdrawalHistory[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [coins, setCoins] = useState<Coin[]>([]);
    const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [memo, setMemo] = useState('');
    const [showCoinSelect, setShowCoinSelect] = useState(false);
    const [showNetworkSelect, setShowNetworkSelect] = useState(false);
    const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>('withdraw');
    const coinSelectRef = useRef<HTMLDivElement>(null);
    const networkSelectRef = useRef<HTMLDivElement>(null);

    // Handle outside clicks for dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (coinSelectRef.current && !coinSelectRef.current.contains(event.target as Node)) {
                setShowCoinSelect(false);
            }
            if (networkSelectRef.current && !networkSelectRef.current.contains(event.target as Node)) {
                setShowNetworkSelect(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch withdrawal methods
    useEffect(() => {
        const fetchWithdrawalMethods = async () => {
            try {
                const response = await fetch('/api/withdrawal-methods');
                if (!response.ok) throw new Error('Failed to fetch withdrawal methods');
                const data = await response.json();
                setCoins(data);
                if (data.length > 0) {
                    setSelectedCoin(data[0]);
                }
            } catch (error) {
                console.error('Error fetching withdrawal methods:', error);
                toast.error('Failed to load withdrawal methods');
            }
        };

        if (isOpen) {
            fetchWithdrawalMethods();
        }
    }, [isOpen]);

    // Fetch withdrawal history
    useEffect(() => {
        const fetchWithdrawalHistory = async () => {
            try {
                setIsHistoryLoading(true);
                const data = await withdrawalApi.getWithdrawalHistory();
                if (data && Array.isArray(data)) {
                    setWithdrawals(data as WithdrawalHistory[]);
                }
            } catch (error) {
                console.error('Error fetching withdrawal history:', error);
                toast.error(t('withdrawal.fetchError'));
            } finally {
                setIsHistoryLoading(false);
            }
        };

        if (isOpen) {
            fetchWithdrawalHistory();
        }
    }, [isOpen, t]);

    // Set default coin and network when modal opens
    useEffect(() => {
        if (isOpen) {
            // Set default coin (USDT) and network (TRC20)
            const defaultCoin = coins.find(coin => coin.id === 'usdt');
            if (defaultCoin) {
                setSelectedCoin(defaultCoin);
                const defaultNetwork = defaultCoin.networks.find(network => network.id === 'trc20');
                if (defaultNetwork) {
                    setSelectedNetwork(defaultNetwork);
                }
            }

            setAmount('');
            setAddress('');
            setMemo('');
        }
    }, [isOpen, coins]);

    // Update networks when coin changes
    useEffect(() => {
        if (selectedCoin) {
            const defaultNetwork = selectedCoin.networks[0];
            if (defaultNetwork) {
                setSelectedNetwork(defaultNetwork);
            }
        }
    }, [selectedCoin]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedCoin(null);
            setSelectedNetwork(null);
            setShowCoinSelect(false);
            setShowNetworkSelect(false);
            setAmount('');
            setAddress('');
            setMemo('');
        }
    }, [isOpen]);

    // Early return after all hooks
    if (!user || !isOpen) return null;

    const handleCopyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
            
            // Show success toast with different messages based on field
            if (field === 'transactionId') {
                toast.success(t('withdrawal.txIdCopied'), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    icon: <FiCheck className="w-5 h-5 text-green-400" />
                });
            }
        } catch (err) {
            console.error('Failed to copy text:', err);
            toast.error(t('withdrawal.copyFailed'), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                icon: <FiXCircle className="w-5 h-5 text-red-400" />
            });
        }
    };

    const handleWithdraw = async () => {
        if (!selectedCoin || !selectedNetwork || !amount || !address) {
            toast.error(t('withdrawal.fillAllFields'));
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error(t('withdrawal.invalidAmount'));
            return;
        }

        if (numAmount < selectedNetwork.minWithdraw) {
            toast.error(t('withdrawal.minAmount', { amount: selectedNetwork.minWithdraw, symbol: selectedCoin.symbol }));
            return;
        }

        if (numAmount > selectedNetwork.maxWithdraw) {
            toast.error(t('withdrawal.maxAmount', { amount: selectedNetwork.maxWithdraw, symbol: selectedCoin.symbol }));
            return;
        }

        if (numAmount > user.balance) {
            toast.error(t('withdrawal.insufficientBalance'));
            return;
        }

        setShowConfirmation(true);
    };

    const confirmWithdrawal = async () => {
        if (!selectedCoin || !selectedNetwork || !amount || !address) {
            toast.error(t('withdrawal.fillAllFields'));
            return;
        }

        const numAmount = parseFloat(amount);

        try {
            setIsProcessing(true);
            const data = await withdrawalApi.createWithdrawal({
                method: selectedCoin.id as 'bkash' | 'nagad' | 'bitget' | 'binance',
                amount: numAmount,
                recipient: address,
                network: selectedNetwork.id
            });

            toast.success(t('withdrawal.success'));
            onClose();
        } catch (error: any) {
            console.error('Withdrawal error:', error);
            toast.error(error.message || t('withdrawal.error'));
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusColor = (status: string) => {
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <FiCheckCircle className="w-5 h-5 text-green-400" />;
            case 'pending':
                return <FiClockCircle className="w-5 h-5 text-yellow-400" />;
            case 'rejected':
                return <FiXCircle className="w-5 h-5 text-red-400" />;
            default:
                return null;
        }
    };

    const validateBangladeshiPhoneNumber = (number: string) => {
        // Remove any non-digit characters
        const cleanNumber = number.replace(/\D/g, '');
        
        // Check if it's exactly 10 digits
        if (cleanNumber.length !== 10) {
            return false;
        }

        // Check if it starts with valid Bangladesh operator codes
        const validPrefixes = ['13', '14', '15', '16', '17', '18', '19'];
        const prefix = cleanNumber.substring(0, 2);
        
        return validPrefixes.includes(prefix);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        if (selectedCoin?.id === 'mobile_banking') {
            // Only allow numbers
            const numbersOnly = value.replace(/\D/g, '');
            
            if (numbersOnly.length <= 10) {
                setAddress(numbersOnly);
                
                if (numbersOnly.length === 10) {
                    if (!validateBangladeshiPhoneNumber(numbersOnly)) {
                        setAddressError(t('withdrawal.invalidBDNumber'));
                    } else {
                        setAddressError('');
                    }
                } else {
                    setAddressError('');
                }
            }
        } else {
            setAddress(value);
            setAddressError('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-[#1E2026] rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl border border-[#2B3139]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#2B3139]">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setActiveTab('withdraw')}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                activeTab === 'withdraw' 
                                    ? 'bg-[#FCD535] text-[#0C0D0F]' 
                                    : 'text-[#A6ADBA] hover:bg-[#2B3139]'
                            }`}
                        >
                            {t('withdrawal.withdraw')}
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                activeTab === 'history' 
                                    ? 'bg-[#FCD535] text-[#0C0D0F]' 
                                    : 'text-[#A6ADBA] hover:bg-[#2B3139]'
                            }`}
                        >
                            {t('withdrawal.history')}
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#A6ADBA] hover:text-white transition-colors"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'withdraw' ? (
                        // Withdrawal form content
                        <div className="space-y-6">
                            {/* Balance Info - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <div className="text-center">
                                    <div className="text-sm text-gray-400">{t('withdrawal.availableBalance')}</div>
                                    <div className="text-2xl font-bold text-white mt-1">${user.balance.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Payment Method - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('withdrawal.method')}</h3>

                                {/* Coin Selection Dropdown */}
                                <div className="mb-4 relative" ref={coinSelectRef}>
                                    <button
                                        onClick={() => {
                                            setShowCoinSelect(!showCoinSelect);
                                            setShowNetworkSelect(false);
                                        }}
                                        className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-700/50 hover:bg-gray-700/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            {selectedCoin?.iconComponent || (
                                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                    <FaCoins className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div className="text-left">
                                                <div className="text-white font-medium">{selectedCoin?.name || t('withdrawal.selectCoin')}</div>
                                                <div className="text-xs text-gray-400">{selectedCoin?.symbol || ''}</div>
                                            </div>
                                        </div>
                                        <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCoinSelect ? 'rotate-180' : ''}`} />
                                    </button>

                                    {showCoinSelect && (
                                        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {coins.map((coin) => (
                                                <button
                                                    key={coin.id}
                                                    onClick={() => {
                                                        setSelectedCoin(coin);
                                                        setShowCoinSelect(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 p-3 hover:bg-gray-700/50 ${selectedCoin?.id === coin.id ? 'bg-blue-500/20' : ''
                                                        }`}
                                                >
                                                    {coin.iconComponent || (
                                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                            <FaCoins className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    <div className="text-left">
                                                        <div className="text-white font-medium">{coin.name}</div>
                                                        <div className="text-xs text-gray-400">{coin.symbol}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Network Selection Dropdown */}
                                {selectedCoin && (
                                    <div className="relative" ref={networkSelectRef}>
                                        <button
                                            onClick={() => {
                                                setShowNetworkSelect(!showNetworkSelect);
                                                setShowCoinSelect(false);
                                            }}
                                            className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-700/50 hover:bg-gray-700/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                {selectedNetwork?.iconComponent || (
                                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                        <FaCoins className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div className="text-left">
                                                    <div className="text-white font-medium">{selectedNetwork?.name || t('withdrawal.selectNetwork')}</div>
                                                    <div className="text-xs text-gray-400">{selectedNetwork?.symbol || ''}</div>
                                                </div>
                                            </div>
                                            <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showNetworkSelect ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showNetworkSelect && (
                                            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {selectedCoin.networks.map((network) => (
                                                    <button
                                                        key={network.id}
                                                        onClick={() => {
                                                            setSelectedNetwork(network);
                                                            setShowNetworkSelect(false);
                                                        }}
                                                        className={`w-full flex items-center gap-3 p-3 hover:bg-gray-700/50 ${selectedNetwork?.id === network.id ? 'bg-blue-500/20' : ''
                                                            }`}
                                                    >
                                                        {network.iconComponent || (
                                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                                <FaCoins className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                        <div className="text-left">
                                                            <div className="text-white font-medium">{network.name}</div>
                                                            <div className="text-xs text-gray-400">
                                                                {t('withdrawal.fee')}: {network.fee} {network.symbol}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Address Input - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">
                                    {selectedCoin?.id === 'mobile_banking'
                                        ? t('withdrawal.phoneNumber')
                                        : t('withdrawal.address')}
                                </h3>
                                <div className="relative">
                                    {selectedCoin?.id === 'mobile_banking' && (
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">+880</span>
                                    )}
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={handleAddressChange}
                                        placeholder={
                                            selectedCoin?.id === 'mobile_banking'
                                                ? "1XXXXXXXXX"
                                                : t('withdrawal.enterAddress')
                                        }
                                        className={`w-full bg-gray-700/50 text-white py-3 rounded-lg text-lg ${
                                            selectedCoin?.id === 'mobile_banking' ? 'pl-14 pr-4' : 'pl-4 pr-4'
                                        } ${addressError ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {selectedCoin?.id === 'mobile_banking' && (
                                    <div className="mt-2 text-xs">
                                        {addressError ? (
                                            <span className="text-red-500">{addressError}</span>
                                        ) : (
                                            <span className="text-gray-400">
                                                {t('withdrawal.phoneNumberFormat')}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Withdrawal Amount - Moved to bottom */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('withdrawal.amount')}</h3>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                    <input
                                        type="text"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-gray-700/50 text-white pl-8 pr-4 py-3 rounded-lg text-lg"
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-400">
                                    <span>{t('withdrawal.min')}: ${selectedNetwork?.minWithdraw.toFixed(2)}</span>
                                    <span>{t('withdrawal.max')}: ${selectedNetwork?.maxWithdraw.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Network Details */}
                            {selectedNetwork && (
                                <div className="bg-gray-700/30 rounded-lg border border-gray-700/50 p-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">{t('withdrawal.fee')}:</span>
                                        <span className="text-white">{selectedNetwork.fee} {selectedNetwork.symbol}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-gray-400">{t('withdrawal.min')}:</span>
                                        <span className="text-white">{selectedNetwork.minWithdraw} {selectedCoin?.symbol}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-gray-400">{t('withdrawal.max')}:</span>
                                        <span className="text-white">{selectedNetwork.maxWithdraw} {selectedCoin?.symbol}</span>
                                    </div>
                                </div>
                            )}

                            {/* Withdraw Button - Telegram Mini App style */}
                            <button
                                onClick={handleWithdraw}
                                disabled={isProcessing || !amount || !selectedNetwork || parseFloat(amount) < (selectedNetwork?.minWithdraw || 0) || parseFloat(amount) > (selectedNetwork?.maxWithdraw || 0) || parseFloat(amount) > user.balance}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        {t('withdrawal.processing')}
                                    </div>
                                ) : (
                                    t('withdrawal.withdrawNow')
                                )}
                            </button>

                            {/* Info - Telegram Mini App style */}
                            <div className="text-xs text-gray-400 text-center">
                                {t('withdrawal.info')}
                            </div>
                        </div>
                    ) : (
                        // History content
                        <div className="space-y-4">
                            <WithdrawalHistory
                                withdrawals={withdrawals}
                                isLoading={isHistoryLoading}
                                t={t}
                                copiedField={copiedField}
                                onCopy={handleCopyToClipboard}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 