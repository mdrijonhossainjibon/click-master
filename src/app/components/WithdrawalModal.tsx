'use client';

import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { RootState } from '../store';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import {
  MIN_CRYPTO_AMOUNT,
  MIN_BDT_AMOUNT,   
  MAX_BDT_AMOUNT,
  USD_TO_BDT_RATE,
  VALIDATION_MESSAGES,
  CRYPTO_PROCESSING_TIME,
  BDT_PROCESSING_TIME,
  NETWORK_FEE_MESSAGE
} from '../constants/withdrawal';

// Types and Enums
enum PaymentMethod {
  BKASH = 'bkash',
  NAGAD = 'nagad',
  BITGET = 'bitget',
  BINANCE = 'binance'
}

enum NetworkType {
  BEP20 = 'bep20',
  BEP2 = 'bep2',
  ERC20 = 'erc20',
  TRC20 = 'trc20'
}

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHistoryClick?: () => void;
}

interface WithdrawalFormData extends FieldValues {
  method: PaymentMethod;
  network?: NetworkType;
  amount: string;
  recipient: string;
  memo?: string;
}

// Network Configuration
const networkOptions: Record<PaymentMethod, Array<{
  value: NetworkType;
  label: string;
  memo?: boolean;
  fee?: string;
  processingTime?: string;
}>> = {
  [PaymentMethod.BINANCE]: [
    { value: NetworkType.BEP20, label: 'BNB Smart Chain (BEP20)', fee: '0.5 USDT', processingTime: '15-30 mins' },
    { value: NetworkType.BEP2, label: 'BNB Beacon Chain (BEP2)', memo: true, fee: '1 USDT', processingTime: '5-15 mins' },
    { value: NetworkType.ERC20, label: 'Ethereum (ERC20)', fee: '15-25 USDT', processingTime: '30-60 mins' },
    { value: NetworkType.TRC20, label: 'TRON (TRC20)', fee: '1 USDT', processingTime: '3-10 mins' }
  ],
  [PaymentMethod.BITGET]: [
    { value: NetworkType.TRC20, label: 'TRON (TRC20)' },
    { value: NetworkType.ERC20, label: 'Ethereum (ERC20)' },
    { value: NetworkType.BEP20, label: 'BNB Smart Chain (BEP20)' }
  ],
  [PaymentMethod.BKASH]: [],
  [PaymentMethod.NAGAD]: []
};

// Styles
const inputStyles = "w-full bg-gray-700/90 text-white rounded-xl p-3 border border-gray-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 placeholder:text-gray-400";
const selectStyles = `${inputStyles} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 8L10 12L14 8" stroke="%239CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')] bg-no-repeat bg-right-1 bg-[length:20px] pr-10`;
const buttonStyles = "w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none group";

export default function WithdrawalModal({ isOpen, onClose, onHistoryClick }: WithdrawalModalProps) {
  const { balance } = useSelector((state: RootState) => state.userStats.userState);
  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<WithdrawalFormData>({
    defaultValues: {
      method: PaymentMethod.BKASH,
      amount: '',
      recipient: '',
    }
  });

  const selectedMethod = watch('method') as PaymentMethod;
  const isCryptoPayment = useMemo(() => 
    [PaymentMethod.BITGET, PaymentMethod.BINANCE].includes(selectedMethod),
    [selectedMethod]
  );

  const isDisabled = useMemo(() => balance < MIN_CRYPTO_AMOUNT, [balance]);

  const validateAmount = useCallback((value: string) => {
    const amount = parseFloat(value);
    if (isCryptoPayment) {
      if (!amount || amount < MIN_CRYPTO_AMOUNT) {
        return VALIDATION_MESSAGES.MIN_CRYPTO;
      }
      if (amount > balance) {
        return VALIDATION_MESSAGES.INSUFFICIENT_BALANCE;
      }
    } else {
      if (!amount || amount < MIN_BDT_AMOUNT) {
        return VALIDATION_MESSAGES.MIN_BDT;
      }
      if (amount > MAX_BDT_AMOUNT) {
        return VALIDATION_MESSAGES.MAX_BDT;
      }
    }
    return true;
  }, [isCryptoPayment, balance]);

  const onSubmit = async (data: WithdrawalFormData) => {
    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit withdrawal request');
      }

      onClose();
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return 'An unexpected error occurred';
    }
  };

  const setMaxAmount = useCallback(() => {
    if (isCryptoPayment) {
      setValue('amount', balance.toFixed(3));
    } else {
      setValue('amount', Math.min(balance * USD_TO_BDT_RATE, MAX_BDT_AMOUNT).toFixed(1));
    }
  }, [isCryptoPayment, balance, setValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 w-full max-w-lg border border-gray-700/50 shadow-2xl transform transition-all duration-300 scale-100 animate-modalSlideIn relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Withdraw Funds</h2>
          {onHistoryClick && (
            <button
              onClick={onHistoryClick}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:scale-95 flex items-center"
            >
              <span className="mr-2">📜</span>
              History
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-gray-700/60 backdrop-blur-sm rounded-xl p-4">
            <p className="text-yellow-400 font-bold mb-2">Available Balance</p>
            <p className="text-2xl font-bold text-white">${balance.toFixed(3)}</p>
            {balance < MIN_CRYPTO_AMOUNT && (
              <p className="text-red-400 text-sm mt-2 font-medium">
                ⚠️ Your balance is below the minimum withdrawal amount (${MIN_CRYPTO_AMOUNT})
              </p>
            )}
          </div>

          <Controller
            name="method"
            control={control}
            render={({ field }) => (
              <select {...field} className={inputStyles} disabled={isDisabled}>
                <option value={PaymentMethod.BKASH}>🏦 bKash - Mobile Banking</option>
                <option value={PaymentMethod.NAGAD}>💳 Nagad - Digital Wallet</option>
                <option value={PaymentMethod.BITGET}>₿ Bitget USDT</option>
                <option value={PaymentMethod.BINANCE}>🌐 Binance USDT</option>
              </select>
            )}
          />

          {isCryptoPayment && (
            <Controller
              name="network"
              control={control}
              rules={{ required: 'Please select a network' }}
              render={({ field }) => (
                <div>
                  <label className="block text-gray-300 mb-2">
                    <span className="flex items-center gap-2">🌐 Network</span>
                  </label>
                  <select {...field} className={inputStyles} disabled={isDisabled}>
                    {networkOptions[selectedMethod].map((network) => (
                      <option key={network.value} value={network.value}>
                        {network.label} - Fee: {network.fee} ({network.processingTime})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />
          )}

          <Controller
            name="recipient"
            control={control}
            rules={{
              required: 'This field is required',
              validate: (value: string) => {
                if (!isCryptoPayment && value.length !== 11) {
                  return VALIDATION_MESSAGES.INVALID_MOBILE;
                }
                return true;
              }
            }}
            render={({ field }) => (
              <div>
                <label className="block text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    {isCryptoPayment ? '🔑 Wallet Address' : '📱 Mobile Number'}
                  </span>
                </label>
                <input
                  {...field}
                  type="text"
                  className={inputStyles}
                  placeholder={isCryptoPayment ? 'Enter your wallet address' : 'Enter your mobile number'}
                  disabled={isDisabled}
                />
                {errors.recipient && (
                  <ErrorMessage message={errors.recipient.message || ''} />
                )}
              </div>
            )}
          />

          <Controller
            name="amount"
            control={control}
            rules={{
              required: 'Amount is required',
              validate: validateAmount
            }}
            render={({ field }) => (
              <div>
                <label className="block text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    {isCryptoPayment ? '💵 Amount (USDT)' : '💰 Amount (BDT)'}
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {isCryptoPayment ? '$' : '৳'}
                  </span>
                  <input
                    {...field}
                    type="number"
                    step={isCryptoPayment ? '0.001' : '1'}
                    className={`${inputStyles} pl-7 pr-20`}
                    disabled={isDisabled}
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
                {errors.amount && (
                  <ErrorMessage message={errors.amount.message || ''} />
                )}
              </div>
            )}
          />

          <div className="bg-gray-700/60 backdrop-blur-sm rounded-xl p-4">
            <p className="text-gray-300 text-sm space-y-1">
              {isCryptoPayment ? (
                <>
                  • Minimum withdrawal: ${MIN_CRYPTO_AMOUNT}<br />
                  • Available for withdrawal: ${balance.toFixed(3)}<br />
                  • Network fee: {selectedMethod === PaymentMethod.BINANCE && watch('network') ? 
                      networkOptions[PaymentMethod.BINANCE].find(n => n.value === watch('network'))?.fee : 
                      NETWORK_FEE_MESSAGE
                    }<br />
                  • Processing time: {selectedMethod === PaymentMethod.BINANCE && watch('network') ? 
                      networkOptions[PaymentMethod.BINANCE].find(n => n.value === watch('network'))?.processingTime : 
                      CRYPTO_PROCESSING_TIME
                    }<br />
                  • Make sure to select the correct network<br />
                  • Double check your wallet address
                  {selectedMethod === PaymentMethod.BINANCE && (
                    <>
                      <br />• For Binance withdrawals, ensure your account has 2FA enabled
                      <br />• Withdrawal address must be whitelisted
                    </>
                  )}
                </>
              ) : (
                <>
                  • Minimum withdrawal: ৳{MIN_BDT_AMOUNT}<br />
                  • Available for withdrawal: ${balance.toFixed(3)} (৳{(balance * USD_TO_BDT_RATE).toFixed(1)})<br />
                  • Maximum withdrawal: ৳{MAX_BDT_AMOUNT}<br />
                  • Rate: $0.001 = ৳0.1<br />
                  • Processing time: {BDT_PROCESSING_TIME}<br />
                  • Make sure to enter the correct number
                </>
              )}
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isDisabled || isSubmitting}
              className={buttonStyles}
            >
              {isSubmitting ? (
                <LoadingSpinner />
              ) : isDisabled ? (
                VALIDATION_MESSAGES.INSUFFICIENT_BALANCE
              ) : (
                'Request Withdrawal'
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-700/90 hover:bg-gray-600/90 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}