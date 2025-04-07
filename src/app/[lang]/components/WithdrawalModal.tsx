'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import Image from 'next/image';

import { LoadingSpinner } from './LoadingSpinner';
import {  toast } from 'react-toastify';
import { ErrorMessage } from './ErrorMessage';
import {
  MIN_CRYPTO_AMOUNT,
  MIN_BDT_AMOUNT,   
  USD_TO_BDT_RATE,
  VALIDATION_MESSAGES,
  CRYPTO_PROCESSING_TIME,
  BDT_PROCESSING_TIME,
  NETWORK_FEE_MESSAGE
} from '../constants/withdrawal';
import { API_CALL } from '@/lib/client';
import { RootState } from '@/modules/store';

// Custom Select Component
interface SelectOption {
  value: string;
  label: string | React.ReactNode;
  icon?: string;
  description?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function CustomSelect({ options, value, onChange, disabled, className, style }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" style={style}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full text-left bg-[#2C2D30] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-600'} ${className}`}
      >
        {selectedOption?.label}
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-[#2C2D30] border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left p-3 hover:bg-[#3A3B3E] transition-colors ${value === option.value ? 'bg-[#3A3B3E]' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
  telegramId: string;
}

interface WithdrawalFormData extends FieldValues {
  method: PaymentMethod;
  network?: NetworkType;
  amount: string;
  recipient: string;
  memo?: string;
}

// Payment Method Configuration
const paymentMethodOptions = [
  {
    value: PaymentMethod.BKASH,
    label: 'bKash - Mobile Banking',
    icon: '/images/BKash-Icon-Logo.wine.svg',
    description: 'Fast local transfers'
  },
  {
    value: PaymentMethod.NAGAD,
    label: 'Nagad - Digital Wallet',
    icon: '/images/nagad-logo.png',
    description: 'Secure digital payments'
  },
  {
    value: PaymentMethod.BITGET,
    label: 'Bitget USDT',
    icon: '/images/tether-usdt-logo.png',
    description: 'Crypto exchange transfer'
  },
  {
    value: PaymentMethod.BINANCE,
    label: 'Binance USDT',
    icon: '/images/tether-usdt-logo.png',
    description: 'Multi-network support'
  }
];

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
const inputStyles = "w-full bg-[#2C2D30] text-white rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-500";
const selectStyles = `${inputStyles} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 8L10 12L14 8" stroke="%239CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')] bg-no-repeat bg-right-1 bg-[length:20px] pr-10`;
const buttonStyles = "w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

// Validation helpers
const validateUSDTAddress = (address: string, network?: NetworkType): boolean => {
  if (!address) return false;
  
  const patterns = {
    [NetworkType.TRC20]: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
    [NetworkType.ERC20]: /^0x[a-fA-F0-9]{40}$/,
    [NetworkType.BEP20]: /^0x[a-fA-F0-9]{40}$/,
    [NetworkType.BEP2]: /^bnb[0-9a-z]{39}$/i
  };
  
  return network ? patterns[network]?.test(address) ?? false : true;
};

const validateMobileNumber = (number: string): boolean => {
  return /^01[3-9]\d{8}$/.test(number);
};

export default function WithdrawalModal({ isOpen, onClose, onHistoryClick, telegramId }: WithdrawalModalProps) {
  const {  user } = useSelector((state: RootState) => state.public.auth);
  const balance = user?.balance || 0;
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
    }
    return true;
  }, [isCryptoPayment, balance]);

  const validateRecipient = useCallback((value: string) => {
    if (!value) return 'This field is required';
    
    if (isCryptoPayment) {
      const network = watch('network');
      if (!validateUSDTAddress(value, network)) {
        return `Invalid ${network?.toUpperCase()} address format`;
      }
    } else {
      if (!validateMobileNumber(value)) {
        return 'Invalid mobile number format (e.g., 01712345678)';
      }
    }
    return true;
  }, [isCryptoPayment, watch]);

  const onSubmit = async (data: WithdrawalFormData) => {
  
    const { response , status }  = await API_CALL({ url :'/withdrawals' , method : 'POST' , body : { ...data , telegramId }});
   
    if(status === 200){
     return toast.success('Withdrawal request submitted successfully');
    }
     
    return toast.error(response?.error as string)
  };

  const setMaxAmount = useCallback(() => {
    if (isCryptoPayment) {
      setValue('amount', balance.toFixed(3));
    } else {
      setValue('amount', (balance * USD_TO_BDT_RATE).toFixed(1));
    }
  }, [isCryptoPayment, balance, setValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 dark:bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-0 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-[#1A1B1E] rounded-2xl w-full h-full sm:h-auto sm:max-w-2xl border border-gray-800 shadow-2xl transform transition-all duration-300 scale-100 animate-modalSlideIn relative sm:my-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-white">Withdraw Crypto</h2>
            {onHistoryClick && (
              <button
                onClick={onHistoryClick}
                className="flex items-center px-3 py-1 bg-[#2C2D30] text-blue-400 text-sm rounded-lg hover:bg-[#3A3B3E] transition-colors"
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M3.05493 11H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19 11H20.9451" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                History
              </button>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-6">
          {/* Balance Display */}
          <div className="bg-[#2C2D30] rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Available Balance</span>
              <span className="text-lg font-medium text-white">${balance.toFixed(3)} USDT</span>
            </div>
            {balance < MIN_CRYPTO_AMOUNT && (
              <div className="flex items-center mt-2 text-xs text-yellow-500">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Minimum withdrawal amount is ${MIN_CRYPTO_AMOUNT} USDT
              </div>
            )}
          </div>

          {/* Coin Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">Coin</label>
              <span className="text-xs text-gray-400">Select withdrawal method</span>
            </div>
            <Controller
              name="method"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  disabled={isDisabled}
                  className="w-full"
                  style={{ height: '60px' }}
                  options={paymentMethodOptions.map(option => ({
                    ...option,
                    label: (
                      <div className="flex items-center gap-3 py-1.5">
                        <div className="w-6 h-6 relative flex-shrink-0">
                          <Image
                            src={option.icon}
                            alt={option.label}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-white">{option.label}</div>
                          <div className="text-xs text-gray-400">{option.description}</div>
                        </div>
                      </div>
                    )
                  }))}
                />
              )}
            />
          </div>

          {/* Network Selection */}
          {isCryptoPayment && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">Network</label>
                <span className="text-xs text-gray-400">Select the network type</span>
              </div>
              <Controller
                name="network"
                control={control}
                rules={{ required: 'Please select a network' }}
                render={({ field }) => (
                  <CustomSelect
                    {...field as any}
                    disabled={isDisabled}
                    className="w-full"
                    style={{ height: '40px' }}
                    options={networkOptions[selectedMethod].map(network => ({
                      value: network.value,
                      label: (
                        <div className="flex flex-col py-1.5">
                          <div className="font-medium text-white">{network.label}</div>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none">
                                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              {network.processingTime}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2v6m0 8v6M4.93 10H2m20 0h-2.93M19.07 14H22m-20 0h2.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                              Fee: {network.fee}
                            </span>
                          </div>
                        </div>
                      )
                    }))}
                  />
                )}
              />
              {errors.network && (
                <p className="mt-1 text-sm text-red-500">{errors.network.message}</p>
              )}
            </div>
          )}

          {/* Address Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">
                {isCryptoPayment ? 'Wallet Address' : 'Mobile Number'}
              </label>
              <span className="text-xs text-gray-400">
                {isCryptoPayment ? 'Enter your wallet address' : 'Enter your mobile number'}
              </span>
            </div>
            <Controller
              name="recipient"
              control={control}
              rules={{
                required: 'This field is required',
                validate: validateRecipient
              }}
              render={({ field }) => (
                <div>
                  <div className="relative">
                    <input
                      {...field}
                      type={isCryptoPayment ? "text" : "tel"}
                      inputMode={isCryptoPayment ? "text" : "numeric"}
                      pattern={isCryptoPayment ? undefined : "[0-9]*"}
                      className={`w-full bg-[#2C2D30] text-white rounded-lg p-3 pr-10 border ${errors.recipient ? 'border-red-500' : 'border-gray-700'} focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-500`}
                      placeholder={isCryptoPayment ? `Enter your ${watch('network')?.toUpperCase()} address` : 'Enter your mobile number'}
                      disabled={isDisabled}
                      onChange={(e) => {
                        if (!isCryptoPayment) {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        } else {
                          field.onChange(e.target.value.trim());
                        }
                      }}
                    />
                    {field.value && (
                      <button
                        type="button"
                        onClick={() => field.onChange('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {errors.recipient && (
                    <p className="mt-1 text-sm text-red-500">{errors.recipient.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">Amount</label>
              <div className="text-xs text-gray-400">
                Available: <span className="text-white">${balance.toFixed(3)} USDT</span>
              </div>
            </div>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: 'Amount is required',
                validate: validateAmount
              }}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    type="number"
                    inputMode="decimal"
                    step={isCryptoPayment ? '0.001' : '1'}
                    className={`w-full bg-[#2C2D30] text-white rounded-lg p-3 pr-20 border ${errors.amount ? 'border-red-500' : 'border-gray-700'} focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-500`}
                    placeholder="0.00"
                    disabled={isDisabled}
                    min={isCryptoPayment ? MIN_CRYPTO_AMOUNT : MIN_BDT_AMOUNT}
                    max={isCryptoPayment ? balance : undefined}
                  />
                  <button
                    type="button"
                    onClick={setMaxAmount}
                    disabled={isDisabled}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-[#2C2D30] text-blue-500 text-sm font-medium rounded hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    MAX
                  </button>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Transaction Details */}
          <div className="bg-[#2C2D30] rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-700/50">
                <span className="text-gray-400">Network</span>
                <span className="text-white font-medium">{watch('network')?.toUpperCase() || '-'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-700/50">
                <span className="text-gray-400">Estimated Arrival</span>
                <span className="text-white font-medium">{selectedMethod === PaymentMethod.BINANCE && watch('network') ? 
                  networkOptions[PaymentMethod.BINANCE].find(n => n.value === watch('network'))?.processingTime : 
                  CRYPTO_PROCESSING_TIME}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Network Fee</span>
                <span className="text-white font-medium">{selectedMethod === PaymentMethod.BINANCE && watch('network') ? 
                  networkOptions[PaymentMethod.BINANCE].find(n => n.value === watch('network'))?.fee : 
                  NETWORK_FEE_MESSAGE}</span>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-yellow-500/10 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-sm text-yellow-500/90">
                <p className="font-medium mb-1">Important</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Please ensure you've selected the correct network</li>
                  <li>Double check the withdrawal address</li>
                  {selectedMethod === PaymentMethod.BINANCE && (
                    <>
                      <li>Ensure your Binance account has 2FA enabled</li>
                      <li>Address must be whitelisted on Binance</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isDisabled || isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner />
                <span className="ml-2">Processing...</span>
              </div>
            ) : isDisabled ? (
              VALIDATION_MESSAGES.INSUFFICIENT_BALANCE
            ) : (
              'Withdraw'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}