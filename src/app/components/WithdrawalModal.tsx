'use client';

import { useEffect, useState } from 'react';

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    balance: number;
    onHistoryClick?: () => void;
}

export default function WithdrawalModal({ isOpen, onClose, balance, onHistoryClick }: WithdrawalModalProps) {
    const [selectedMethod, setSelectedMethod] = useState("bkash");
    const [mobileNumber, setMobileNumber] = useState("");
    const [bdtAmount, setBdtAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        setIsDisabled(balance < 0.002);
    }, [balance]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            method: selectedMethod,
            amount: selectedMethod === 'bkash' || selectedMethod === 'nagad' ? bdtAmount : withdrawAmount,
            recipient: selectedMethod === 'bkash' || selectedMethod === 'nagad' ? mobileNumber : walletAddress,
        };
        console.log('Withdrawal request:', data);
        onClose();
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMethod(e.target.value);
        // Reset form fields when payment method changes
        setBdtAmount("");
        setWithdrawAmount("");
        setMobileNumber("");
        setWalletAddress("");
    };

    const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
        setMobileNumber(value);
    };

    const setMaxAmount = () => {
        if (selectedMethod === 'bkash' || selectedMethod === 'nagad') {
            setBdtAmount(Math.min(balance * 100, 5000).toFixed(1));
        } else {
            setWithdrawAmount(balance.toFixed(3));
        }
    };

    const isCryptoPayment = selectedMethod === 'bitget' || selectedMethod === 'binance';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white text-center">Withdraw Funds</h2>
                    <button
                        onClick={onHistoryClick}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:scale-95 flex items-center"
                    >
                        <span className="mr-2">📜</span>
                        History
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-gray-700/50 rounded-xl p-4">
                        <p className="text-yellow-400 font-bold mb-2">Available Balance:</p>
                        <p className="text-2xl font-bold text-white">${balance.toFixed(3)}</p>
                        {balance < 0.002 && (
                            <p className="text-red-400 text-sm mt-2 font-medium">
                                ⚠️ Your balance is below the minimum withdrawal amount ($0.002)
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Select Payment Method</label>
                        <select
                            value={selectedMethod}
                            onChange={handlePaymentChange}
                            disabled={isDisabled}
                            className="w-full bg-gray-700 text-white rounded-xl p-3 pl-10 border border-gray-600 focus:border-purple-500 focus:outline-none appearance-none"
                        >
                            <option value="bkash">
                                bKash
                            </option>
                            <option value="nagad">
                                Nagad
                            </option>
                            <option value="bitget">
                                Bitget USDT
                            </option>
                            <option value="binance">
                                Binance USDT (BEP20)
                            </option>
                        </select>
                    </div>

                    {!isCryptoPayment ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Mobile Number</label>
                                <input
                                    type="text"
                                    value={mobileNumber}
                                    onChange={handleMobileNumberChange}
                                    placeholder="Enter your mobile number"
                                    disabled={isDisabled}
                                    className="w-full bg-gray-700 text-white rounded-xl p-3 border border-gray-600 focus:border-purple-500 focus:outline-none"
                                />
                                <p className="text-sm text-gray-400 mt-1">Format: 01XXXXXXXXX</p>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Amount (BDT)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">৳</span>
                                    <input
                                        type="number"
                                        value={bdtAmount}
                                        onChange={(e) => setBdtAmount(e.target.value)}
                                        placeholder="0"
                                        min="50"
                                        max="5000"
                                        disabled={isDisabled}
                                        className="w-full bg-gray-700 text-white rounded-xl p-3 pl-7 pr-20 border border-gray-600 focus:border-purple-500 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={setMaxAmount}
                                        disabled={isDisabled}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 active:scale-95"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Withdrawal Amount (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="0.000"
                                        step="0.001"
                                        min="0.002"
                                        disabled={isDisabled}
                                        className="w-full bg-gray-700 text-white rounded-xl p-3 pl-7 pr-20 border border-gray-600 focus:border-purple-500 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={setMaxAmount}
                                        disabled={isDisabled}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 active:scale-95"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Wallet Address</label>
                                <input
                                    type="text"
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                    placeholder="Enter your wallet address"
                                    disabled={isDisabled}
                                    className="w-full bg-gray-700 text-white rounded-xl p-3 border border-gray-600 focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-700/50 rounded-xl p-4">
                        <p className="text-gray-300 text-sm">
                            • Minimum withdrawal: ৳50 ($0.50)<br />
                            • Available for withdrawal: ${balance.toFixed(3)} (৳{(balance * 100).toFixed(1)})<br />
                            • Maximum withdrawal: ৳5000<br />
                            • Rate: $0.001 = ৳0.1<br />
                            • Processing time: 24-48 hours<br />
                            • Make sure to enter the correct {isCryptoPayment ? 'wallet address' : 'number'}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isDisabled ? 'Insufficient Balance' : 'Request Withdrawal'}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl mt-2 transition-all duration-300"
                    >
                        Close
                    </button>
                </form>
            </div>
        </div>
    );
}