import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XMarkIcon,
  BookmarkIcon,
  ArrowPathIcon,
  ClipboardIcon,
  ChevronUpDownIcon,
  ClockIcon,
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import WithdrawalHistory from './WithdrawalHistory';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NetworkOption {
  id: string;
  name: string;
  supportedCoins: string[];
  icon: string;
  active: boolean;
  fee: string;
  estimatedTime: string;
  category: 'Mobile Banking' | 'Crypto';
  minAmount: number;
  maxAmount: number;
  currency: string;
}

interface Coin {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  active: boolean;
  minAmount: number;
  maintenanceMessage?: string;
}

// Add these color constants at the top of the file
const colors = {
  background: '#0B0E11',
  cardBg: '#1E2329',
  inputBg: '#2B3139',
  border: '#2E353F',
  yellow: '#FCD535',
  yellowHover: '#FCD535',
  text: {
    primary: '#EAECEF',
    secondary: '#848E9C',
    yellow: '#C99400'
  }
};

// Add phone number validation and formatting functions
const formatBDPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Handle different BD number formats
  let formatted = digits;
  
  // If starts with 880, convert to local format
  if (digits.startsWith('880')) {
    formatted = '0' + digits.slice(3);
  }
  // If starts with +880, convert to local format
  else if (digits.startsWith('880')) {
    formatted = '0' + digits.slice(3);
  }
  // If starts with just 1, add 0
  else if (digits.startsWith('1')) {
    formatted = '0' + digits;
  }
  
  // Format as: +880 1XXX-XXXXXX
  if (formatted.length >= 6) {
    // Convert back to international format
    formatted = formatted.replace(/^0/, '880');
    formatted = '+' + formatted.slice(0, 3) + ' ' + 
                formatted.slice(3, 7) + '-' + 
                formatted.slice(7);
  }
  
  return formatted;
};

const isValidBDPhoneNumber = (phone: string): boolean => {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check if it's a valid BD phone number
  // Must be either 11 digits starting with '01' or 13 digits starting with '880'
  return /^01[3-9]\d{8}$/.test(digits) || /^880[1][3-9]\d{8}$/.test(digits);
};

const getPhoneNumberError = (phone: string): string => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  
  // Convert to local format for validation
  const localFormat = digits.startsWith('880') ? '0' + digits.slice(3) : digits;
  
  if (!localFormat.startsWith('01')) {
    return 'Number must start with +880 or 01';
  }
  if (digits.startsWith('880') && digits.length !== 13) {
    return 'International format must be 13 digits';
  }
  if (!digits.startsWith('880') && digits.length !== 11) {
    return 'Local format must be 11 digits';
  }
  if (!isValidBDPhoneNumber(digits)) {
    return 'Invalid phone number';
  }
  return '';
};

export default function WithdrawalModal({ isOpen, onClose }: WithdrawalModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    amount: '',
    walletAddress: '',
    selectedCoin: 'USDT',
    selectedNetwork: '',
  });
  const [phoneError, setPhoneError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Mock data - replace with actual data
  const mockBalances = {
    USDT: { amount: '1000.00', inOrder: '0.00', fee: '1' },
    BTC: { amount: '0.5', inOrder: '0.1', fee: '0.0005' },
    ETH: { amount: '2.5', inOrder: '0.2', fee: '0.005' },
    BNB: { amount: '10.0', inOrder: '1.0', fee: '0.001' }
  };

  const coins = [
    { 
      id: 'BDT', 
      name: 'Bangladeshi Taka', 
      symbol: 'BDT', 
      icon: '/images/payment/bdt.png',
      color: '#006A4E',
      active: true,
      minAmount: 500
    },
    { 
      id: 'USDT', 
      name: 'Tether', 
      symbol: 'USDT', 
      icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
      color: '#26A17B',
      active: true,
      minAmount: 1
    },
    { 
      id: 'BTC', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      color: '#F7931A',
      active: true,
      minAmount: 0.0001
    },
    { 
      id: 'ETH', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      color: '#627EEA',
      active: false,
      minAmount: 0.01,
      maintenanceMessage: 'Ethereum withdrawals temporarily disabled'
    },
    { 
      id: 'BNB', 
      name: 'BNB', 
      symbol: 'BNB', 
      icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
      color: '#F3BA2F',
      active: false,
      minAmount: 0.1,
      maintenanceMessage: 'BNB network maintenance'
    },
  ];

  const networks: NetworkOption[] = [
    { 
      id: 'BKASH', 
      name: 'bKash', 
      supportedCoins: ['USDT', 'BDT'],
      icon: '/images/payment/bkash.png',
      active: true,
      fee: '1.5%',
      estimatedTime: '5-30 min',
      category: 'Mobile Banking',
      minAmount: 500,
      maxAmount: 25000,
      currency: 'BDT'
    },
    { 
      id: 'NAGAD', 
      name: 'Nagad', 
      supportedCoins: ['USDT', 'BDT'],
      icon: '/images/payment/nagad.png',
      active: true,
      fee: '1.5%',
      estimatedTime: '5-30 min',
      category: 'Mobile Banking',
      minAmount: 500,
      maxAmount: 25000,
      currency: 'BDT'
    },
    { 
      id: 'ROCKET', 
      name: 'Rocket', 
      supportedCoins: ['USDT', 'BDT'],
      icon: '/images/payment/rocket.png',
      active: true,
      fee: '1.5%',
      estimatedTime: '5-30 min',
      category: 'Mobile Banking',
      minAmount: 500,
      maxAmount: 25000,
      currency: 'BDT'
    },
    { 
      id: 'ETH', 
      name: 'Ethereum (ERC20)', 
      supportedCoins: ['USDT', 'ETH'],
      icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      active: true,
      fee: '15 USDT',
      estimatedTime: '5-20 min',
      category: 'Crypto',
      minAmount: 20,
      maxAmount: 100000,
      currency: 'USDT'
    },
    { 
      id: 'BSC', 
      name: 'BNB Smart Chain (BEP20)', 
      supportedCoins: ['USDT', 'BNB'],
      icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
      active: true,
      fee: '1 USDT',
      estimatedTime: '3-10 min',
      category: 'Crypto',
      minAmount: 10,
      maxAmount: 100000,
      currency: 'USDT'
    },
    { 
      id: 'TRON', 
      name: 'TRON (TRC20)', 
      supportedCoins: ['USDT'],
      icon: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
      active: true,
      fee: '1 USDT',
      estimatedTime: '3-5 min',
      category: 'Crypto',
      minAmount: 10,
      maxAmount: 100000,
      currency: 'USDT'
    },
    { 
      id: 'BTC', 
      name: 'Bitcoin Network', 
      supportedCoins: ['BTC'],
      icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      active: true,
      fee: '0.0005 BTC',
      estimatedTime: '10-60 min',
      category: 'Crypto',
      minAmount: 0.001,
      maxAmount: 10,
      currency: 'BTC'
    }
  ];

  const [availableNetworks, setAvailableNetworks] = useState<NetworkOption[]>([]);

  useEffect(() => {
    // Update available networks when selected coin changes
    const filteredNetworks = networks.filter(network => {
      if (formData.selectedCoin === 'BDT') {
        // Show only mobile banking networks for BDT
        return network.category === 'Mobile Banking';
      } else {
        // Show only crypto networks for other coins
        return network.category === 'Crypto' && network.supportedCoins.includes(formData.selectedCoin);
      }
    });
    
    setAvailableNetworks(filteredNetworks);
    
    // Reset selected network if current selection is not valid for new coin
    if (!filteredNetworks.find(n => n.id === formData.selectedNetwork)) {
      setFormData(prev => ({ ...prev, selectedNetwork: '' }));
    }
  }, [formData.selectedCoin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'walletAddress' && formData.selectedCoin === 'BDT') {
      // Format and validate BD phone number
      const formattedNumber = formatBDPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedNumber }));
      setPhoneError(getPhoneNumberError(formattedNumber));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMaxClick = () => {
    const coinBalance = mockBalances[formData.selectedCoin as keyof typeof mockBalances];
    if (coinBalance) {
      const availableBalance = parseFloat(coinBalance.amount) - parseFloat(coinBalance.inOrder);
      setFormData(prev => ({
        ...prev,
        amount: Math.max(0, availableBalance).toString()
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number for BDT withdrawals
    if (formData.selectedCoin === 'BDT') {
      const error = getPhoneNumberError(formData.walletAddress);
      if (error) {
        toast.error('Please enter a valid phone number');
        return;
      }
    }

    try {
      setIsLoading(true);
      // Add your withdrawal logic here
      
      toast.success('Withdrawal request submitted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to process withdrawal request');
    } finally {
      setIsLoading(false);
    }
  };

  const getNetworkTips = () => {
    const selectedNetwork = networks.find(n => n.id === formData.selectedNetwork);
    
    if (!selectedNetwork) return null;

    const tips = {
      ETH: {
        warning: 'High gas fees may apply on Ethereum network',
        processingTime: '5-20 minutes',
        minAmount: '50 USDT'
      },
      BSC: {
        warning: 'Ensure your wallet supports BEP20 tokens',
        processingTime: '3-10 minutes',
        minAmount: '10 USDT'
      },
      TRON: {
        warning: 'Only send to TRON (TRX) addresses',
        processingTime: '1-5 minutes',
        minAmount: '1 USDT'
      },
      BTC: {
        warning: 'Bitcoin transactions may take longer to confirm',
        processingTime: '10-60 minutes',
        minAmount: '0.001 BTC'
      }
    };

    return tips[selectedNetwork.id as keyof typeof tips];
  };

  const networkTips = getNetworkTips();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCoinDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const firstActiveCoin = coins.find(coin => coin.active);
    if (firstActiveCoin) {
      setFormData(prev => ({ ...prev, selectedCoin: firstActiveCoin.id }));
    }
  }, []);

  // Add state and ref for network dropdown
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const networkDropdownRef = useRef<HTMLDivElement>(null);

  // Add click outside handler for network dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (networkDropdownRef.current && !networkDropdownRef.current.contains(event.target as Node)) {
        setShowNetworkDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="min-h-screen w-screen flex items-center justify-center sm:p-4 p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="w-screen h-screen sm:h-auto sm:w-full sm:max-w-2xl transform overflow-hidden bg-[#0B0E11] sm:border sm:border-[#2E353F] sm:rounded-lg transition-all">
                  {/* Header */}
                  <div className="sticky top-0 z-10 border-b border-[#2E353F] bg-[#0B0E11] p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-lg p-1.5 text-[#1E2329] bg-[#F0B90B] hover:bg-[#F0B90B]/80 focus:outline-none sm:hidden transition-all"
                        >
                          <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <Dialog.Title as="h3" className="text-xl font-semibold text-white flex items-center gap-2">
                          Withdraw {formData.selectedCoin}
                          <QuestionMarkCircleIcon 
                            className="h-5 w-5 text-[#1E2329] bg-[#F0B90B] hover:bg-[#F0B90B]/80 rounded-full p-1 cursor-pointer transition-all" 
                          />
                        </Dialog.Title>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowHistory(true)}
                          className="rounded-lg p-1.5 text-[#1E2329] bg-[#F0B90B] hover:bg-[#F0B90B]/80 focus:outline-none flex items-center gap-2 transition-all"
                        >
                          <ClockIcon className="h-5 w-5" />
                          <span className="text-sm hidden sm:inline font-medium">History</span>
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-[#1E2329] bg-[#F0B90B] hover:bg-[#F0B90B]/80 focus:outline-none transition-all"
                        >
                          <Cog6ToothIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-lg p-1.5 text-[#1E2329] bg-[#F0B90B] hover:bg-[#F0B90B]/80 focus:outline-none transition-all hidden sm:block"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="h-[calc(100vh-70px)] sm:h-auto overflow-y-auto p-4 sm:p-6 bg-[#0B0E11]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Coin Selection */}
                      <div className="bg-[#1E2329] rounded-lg p-4 border border-[#2E353F]">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-[#EAECEF]">
                            Coin
                          </label>
                          <div className="text-sm text-[#848E9C]">
                            Available Balance
                          </div>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                          <button
                            type="button"
                            onClick={() => setShowCoinDropdown(!showCoinDropdown)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-lg bg-[#2B3139] border border-[#2E353F] text-white focus:outline-none focus:border-[#FCD535] transition-all cursor-pointer hover:bg-[#363B44] flex items-center justify-between"
                          >
                            {formData.selectedCoin ? (
                              <div className="flex items-center">
                                <div className="w-6 h-6 relative mr-3">
                                  <Image
                                    src={coins.find(c => c.id === formData.selectedCoin)?.icon || ''}
                                    alt={formData.selectedCoin}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                  />
                                </div>
                                <span className="text-white">
                                  {coins.find(c => c.id === formData.selectedCoin)?.name} ({formData.selectedCoin})
                                </span>
                              </div>
                            ) : (
                              <span className="text-white">Select coin</span>
                            )}
                            <ChevronUpDownIcon className={`h-5 w-5 text-white transition-transform duration-200 ${showCoinDropdown ? 'transform rotate-180' : ''}`} />
                          </button>

                          <Transition
                            show={showCoinDropdown}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <div className="absolute z-10 mt-2 w-full rounded-lg bg-[#1E2329] border border-[#2E353F] shadow-lg">
                              <div className="py-1">
                                {coins.map((coin) => (
                                  <button
                                    key={coin.id}
                                    type="button"
                                    onClick={() => {
                                      if (coin.active) {
                                        setFormData(prev => ({ ...prev, selectedCoin: coin.id }));
                                        setShowCoinDropdown(false);
                                      }
                                    }}
                                    disabled={!coin.active}
                                    className={`w-full px-4 py-3 flex items-center group ${
                                      !coin.active 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : 'hover:bg-[#2B3139]'
                                    } ${
                                      formData.selectedCoin === coin.id ? 'bg-[#2B3139]' : ''
                                    }`}
                                  >
                                    <div className="w-6 h-6 relative mr-3">
                                      <Image
                                        src={coin.icon}
                                        alt={coin.symbol}
                                        width={24}
                                        height={24}
                                        className={`rounded-full ${!coin.active ? 'grayscale' : ''}`}
                                      />
                                    </div>
                                    <div className="flex flex-col items-start">
                                      <div className="flex items-center">
                                        <span className="text-white">{coin.name}</span>
                                        {!coin.active && (
                                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#2B3139] text-white">
                                            Disabled
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center text-xs">
                                        <span className="text-white">{coin.symbol}</span>
                                        {!coin.active && coin.maintenanceMessage && (
                                          <span className="ml-2 text-[#CD6D6D]">{coin.maintenanceMessage}</span>
                                        )}
                                      </div>
                                    </div>
                                    {formData.selectedCoin === coin.id && coin.active && (
                                      <svg className="h-5 w-5 text-[#02C076] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </Transition>
                          
                          <div className="mt-2 flex items-center justify-between text-sm">
                            <span className="text-white">
                              Available: {mockBalances[formData.selectedCoin as keyof typeof mockBalances]?.amount || '0.00'} {formData.selectedCoin}
                            </span>
                            <span className="text-white">
                              In Order: {mockBalances[formData.selectedCoin as keyof typeof mockBalances]?.inOrder || '0.00'} {formData.selectedCoin}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Network Selection */}
                      <div className="bg-[#1E2329] rounded-lg p-4 border border-[#2E353F]">
                        <label className="block text-sm font-medium text-[#EAECEF] mb-3">
                          Network
                        </label>
                        <div className="relative" ref={networkDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                            disabled={!availableNetworks.length}
                            className={`w-full pl-12 pr-4 py-3.5 rounded-lg bg-[#2B3139] border border-[#2E353F] text-white focus:outline-none focus:border-[#FCD535] transition-all flex items-center justify-between ${
                              availableNetworks.length ? 'cursor-pointer hover:bg-[#363B44]' : 'cursor-not-allowed opacity-50'
                            }`}
                          >
                            {formData.selectedNetwork ? (
                              <>
                                <div className="flex items-center">
                                  <div className="w-6 h-6 relative mr-3">
                                    <Image
                                      src={networks.find(n => n.id === formData.selectedNetwork)?.icon || ''}
                                      alt={formData.selectedNetwork}
                                      width={24}
                                      height={24}
                                      className="rounded-full"
                                    />
                                  </div>
                                  <span className="text-white">
                                    {networks.find(n => n.id === formData.selectedNetwork)?.name}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span className="text-white">
                                {formData.selectedCoin === 'BDT' 
                                  ? 'Select mobile banking method'
                                  : 'Select withdrawal network'
                                }
                              </span>
                            )}
                            <ChevronUpDownIcon className={`h-5 w-5 text-[#848E9C] transition-transform duration-200 ${showNetworkDropdown ? 'transform rotate-180' : ''}`} />
                          </button>

                          <Transition
                            show={showNetworkDropdown}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <div className="absolute z-10 mt-2 w-full rounded-lg bg-[#1E2329] border border-[#2E353F] shadow-lg">
                              <div className="py-1">
                                {availableNetworks.map((network) => (
                                  <button
                                    key={network.id}
                                    type="button"
                                    onClick={() => {
                                      if (network.active) {
                                        setFormData(prev => ({ ...prev, selectedNetwork: network.id }));
                                        setShowNetworkDropdown(false);
                                      }
                                    }}
                                    disabled={!network.active}
                                    className={`w-full px-4 py-3 flex items-center group ${
                                      !network.active 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : 'hover:bg-[#2B3139]'
                                    } ${
                                      formData.selectedNetwork === network.id ? 'bg-[#2B3139]' : ''
                                    }`}
                                  >
                                    <div className="w-6 h-6 relative mr-3">
                                      <Image
                                        src={network.icon}
                                        alt={network.id}
                                        width={24}
                                        height={24}
                                        className={`rounded-full ${!network.active ? 'grayscale' : ''}`}
                                      />
                                    </div>
                                    <div className="flex flex-col items-start flex-1">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                          <span className="text-[#EAECEF]">{network.name}</span>
                                          {!network.active && (
                                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#2B3139] text-[#848E9C]">
                                              Disabled
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-xs text-[#848E9C]">
                                          Fee: {network.fee}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between w-full text-xs">
                                        <span className="text-[#848E9C]">
                                          Est. Time: {network.estimatedTime}
                                        </span>
                                        <span className="text-[#848E9C]">
                                          {network.minAmount} - {network.maxAmount} {network.currency}
                                        </span>
                                      </div>
                                    </div>
                                    {formData.selectedNetwork === network.id && network.active && (
                                      <svg className="h-5 w-5 text-[#02C076] ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </Transition>
                        </div>
                        {formData.selectedNetwork && (
                          <div className="mt-2 flex items-center justify-between text-sm">
                            <span className="text-white">
                              Network Fee: {networks.find(n => n.id === formData.selectedNetwork)?.fee}
                            </span>
                            <span className="text-white">
                              Est. Time: {networks.find(n => n.id === formData.selectedNetwork)?.estimatedTime}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Address and Amount */}
                      <div className="bg-[#1E2329] rounded-lg p-4 border border-[#2E353F]">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label htmlFor="walletAddress" className="block text-sm font-medium text-[#EAECEF]">
                                {formData.selectedCoin === 'BDT' ? 'Phone Number' : 'Wallet Address'}
                              </label>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  className="inline-flex items-center text-sm text-[#C99400] hover:text-[#FCD535]"
                                >
                                  <BookmarkIcon className="h-4 w-4 mr-1" />
                                  {formData.selectedCoin === 'BDT' ? 'Saved Numbers' : 'Address Book'}
                                </button>
                                <button
                                  type="button"
                                  className="text-[#C99400] hover:text-[#FCD535]"
                                >
                                  <ClipboardIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                id="walletAddress"
                                name="walletAddress"
                                type={formData.selectedCoin === 'BDT' ? 'tel' : 'text'}
                                required
                                value={formData.walletAddress}
                                onChange={handleInputChange}
                                className={`w-full pl-4 pr-10 py-3 rounded-lg bg-[#2B3139] border ${
                                  phoneError && formData.selectedCoin === 'BDT' 
                                    ? 'border-red-500 focus:border-red-500' 
                                    : 'border-[#2E353F] focus:border-[#FCD535]'
                                } text-[#EAECEF] placeholder-white focus:outline-none transition-all`}
                                placeholder={formData.selectedCoin === 'BDT' 
                                  ? 'Enter number (+880 or 01)' 
                                  : `Enter your ${formData.selectedNetwork || 'wallet'} address`
                                }
                                pattern={formData.selectedCoin === 'BDT' ? '[0-9+\\- ]*' : undefined}
                                inputMode={formData.selectedCoin === 'BDT' ? 'numeric' : 'text'}
                              />
                              {formData.selectedCoin === 'BDT' && (
                                <div className="mt-1 text-xs text-[#848E9C]">
                                  Format: +880 1XXX-XXXXXX or 01XXX-XXXXXX 
                                </div>
                              )}
                            </div>
                            {formData.selectedCoin === 'BDT' && phoneError && (
                              <div className="mt-1 text-sm text-red-500">
                                {phoneError}
                              </div>
                            )}
                            {formData.selectedCoin === 'BDT' && formData.selectedNetwork && (
                              <div className="mt-2 text-sm text-[#848E9C]">
                                Your withdrawal will be sent to your {networks.find(n => n.id === formData.selectedNetwork)?.name} account
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label htmlFor="amount" className="block text-sm font-medium text-[#EAECEF]">
                                Amount
                              </label>
                              <button
                                type="button"
                                onClick={handleMaxClick}
                                className="text-sm text-[#C99400] hover:text-[#FCD535] font-medium"
                              >
                                MAX
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                id="amount"
                                name="amount"
                                type="number"
                                required
                                min="0"
                                step="0.000001"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="w-full pl-4 pr-16 py-3 rounded-lg bg-[#2B3139] border border-[#2E353F] text-[#EAECEF] placeholder-white focus:outline-none focus:border-[#FCD535] transition-all"
                                placeholder={`Minimum ${mockBalances[formData.selectedCoin as keyof typeof mockBalances]?.fee}`}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#848E9C]">
                                {formData.selectedCoin}
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm">
                              <span className="text-[#848E9C]">
                                Fee: {mockBalances[formData.selectedCoin as keyof typeof mockBalances]?.fee} {formData.selectedCoin}
                              </span>
                              <span className="text-[#848E9C]">
                                You will receive: {formData.amount ? (parseFloat(formData.amount) - parseFloat(mockBalances[formData.selectedCoin as keyof typeof mockBalances]?.fee || '0')).toFixed(6) : '0'} {formData.selectedCoin}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {networkTips && (
                        <div className="bg-[#1E2329] rounded-lg p-4 border border-[#2E353F]">
                          <h4 className="text-sm font-medium text-[#EAECEF] mb-3 flex items-center">
                            <InformationCircleIcon className="h-5 w-5 mr-2 text-[#C99400]" />
                            Important Information
                          </h4>
                          <ul className="space-y-2">
                            <li className="flex items-start text-sm">
                              <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-[#F0B90B] flex-shrink-0 mt-0.5" />
                              <span className="text-[#848E9C]">{networkTips.warning}</span>
                            </li>
                            <li className="flex items-center text-sm">
                              <ArrowPathIcon className="h-5 w-5 mr-2 text-[#848E9C]" />
                              <span className="text-[#848E9C]">Processing Time: {networkTips.processingTime}</span>
                            </li>
                            <li className="flex items-center text-sm">
                              <InformationCircleIcon className="h-5 w-5 mr-2 text-[#02C076]" />
                              <span className="text-[#848E9C]">Minimum Withdrawal: {networkTips.minAmount}</span>
                            </li>
                          </ul>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="fixed bottom-0 left-0 right-0 sm:relative p-4 sm:p-0 bg-[#0B0E11] border-t border-[#2E353F] sm:border-0">
                        <div className="flex gap-3 sm:mt-2">
                          <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 px-4 rounded-lg text-sm font-semibold text-[#EAECEF] bg-[#2B3139] hover:bg-[#363B44] border border-[#2E353F] focus:outline-none transition-all duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-3.5 px-4 rounded-lg text-sm font-semibold text-[#1E2329] bg-[#FCD535] hover:bg-[#FCD535]/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            {isLoading ? "Processing..." : "Withdraw"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <WithdrawalHistory 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
      />
    </>
  );
} 