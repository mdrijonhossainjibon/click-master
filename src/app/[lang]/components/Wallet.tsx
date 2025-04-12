import { useState } from 'react';
import WithdrawalModal from './WithdrawalModal';

export default function Wallet() {
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [balance, setBalance] = useState(1000); // Example balance, replace with actual balance from your API

    return (
        <div className="p-6">
            <div className="bg-[#181A20] rounded-lg p-6 border border-[#2B3139]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Wallet</h2>
                        <p className="text-[#848E9C]">Manage your funds</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[#848E9C]">Available Balance</p>
                        <p className="text-2xl font-bold text-white">${balance.toFixed(2)}</p>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={() => setIsWithdrawalModalOpen(true)}
                        className="flex-1 bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                        Withdraw
                    </button>
                    <button
                        className="flex-1 bg-[#2B3139] hover:bg-[#2B3139]/80 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                        Deposit
                    </button>
                </div>
            </div>

            <WithdrawalModal
                isOpen={isWithdrawalModalOpen}
                onClose={() => setIsWithdrawalModalOpen(false)}
            />
        </div>
    );
} 