import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/modules/store';
import { fetchWithdrawalHistory } from '@/modules/public/withdrawal/withdrawalActions';

import { 
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Image } from 'antd-mobile';

interface WithdrawalHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WithdrawalRecord {
  id: string;
  coin: string;
  network: string;
  amount: string;
  fee: string;
  address: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  txId?: string;
  icon: string;
  receivedAmount?: string;
  estimatedArrivalTime?: string;
  confirmations?: number;
  processingTime?: string;
}

// Mock data for withdrawal history
const mockWithdrawals: WithdrawalRecord[] = [
  {
    id: '1',
    coin: 'USDT',
    network: 'TRON (TRC20)',
    amount: '1000.00',
    fee: '1.00',
    address: 'TNVrLxqQY8EMHnvkht4Mj8cZyp4QhXqgcK',
    status: 'completed',
    timestamp: '2024-03-15 14:30:00',
    txId: '7d1c12c982604982a2416e3e099ab55d',
    icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png'
  },
  {
    id: '2',
    coin: 'BDT',
    network: 'bKash',
    amount: '25000.00',
    fee: '375.00',
    address: '+880 1XXX-XXXXXX',
    status: 'pending',
    timestamp: '2024-03-15 14:25:00',
    icon: 'https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg'
  },
  {
    id: '3',
    coin: 'BTC',
    network: 'Bitcoin Network',
    amount: '0.05',
    fee: '0.0005',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    status: 'failed',
    timestamp: '2024-03-15 14:20:00',
    icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
  },
];

const StatusBadge = ({ status }: { status: WithdrawalRecord['status'] }) => {
  const statusConfig = {
    completed: {
      icon: CheckCircleIcon,
      text: 'Completed',
      bgColor: 'bg-[#02C076]/10',
      textColor: 'text-[#02C076]',
      iconColor: 'text-[#02C076]'
    },
    pending: {
      icon: ClockIcon,
      text: 'Processing',
      bgColor: 'bg-[#F0B90B]/10',
      textColor: 'text-[#F0B90B]',
      iconColor: 'text-[#F0B90B]'
    },
    failed: {
      icon: XCircleIcon,
      text: 'Failed',
      bgColor: 'bg-[#CD6D6D]/10',
      textColor: 'text-[#CD6D6D]',
      iconColor: 'text-[#CD6D6D]'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-full ${config.bgColor}`}>
      <Icon className={`h-4 w-4 mr-1.5 ${config.iconColor}`} />
      <span className={`text-sm font-medium ${config.textColor}`}>{config.text}</span>
    </div>
  );
};

interface WithdrawalDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawal: WithdrawalRecord;
}

const WithdrawalDetails = ({ isOpen, onClose, withdrawal }: WithdrawalDetailsProps) => {
  const getReceivedAmount = () => {
    const amount = parseFloat(withdrawal.amount);
    const fee = parseFloat(withdrawal.fee);
    return (amount - fee).toFixed(8);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
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
                        className="rounded-lg p-1.5 text-[#1E2329] bg-[#F0B90B] hover:bg-[#F0B90B]/80 focus:outline-none transition-all"
                      >
                        <ArrowLeftIcon className="h-5 w-5" />
                      </button>
                      <Dialog.Title as="h3" className="text-xl font-semibold text-white">
                        Withdrawal Details
                      </Dialog.Title>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-6 max-h-[calc(100vh-80px)] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative">
                        <Image
                          src={withdrawal.icon}
                          alt={withdrawal.coin}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">
                          {withdrawal.amount} {withdrawal.coin}
                        </h4>
                        <p className="text-[#848E9C]">{withdrawal.timestamp}</p>
                      </div>
                    </div>
                    <StatusBadge status={withdrawal.status} />
                  </div>

                  {/* Status Timeline */}
                  <div className="space-y-4 bg-[#1E2329] rounded-lg p-4">
                    <div className="flex items-center gap-2 text-[#02C076]">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>Withdrawal Request Submitted</span>
                      <div className="text-[#848E9C] ml-auto text-sm">{withdrawal.timestamp}</div>
                    </div>
                    {withdrawal.status !== 'failed' && (
                      <>
                        <div className={`flex items-center gap-2 ${withdrawal.status === 'pending' ? 'text-[#F0B90B]' : 'text-[#02C076]'}`}>
                          <ClockIcon className="h-5 w-5" />
                          <span>Processing</span>
                          {withdrawal.processingTime && (
                            <div className="text-[#848E9C] ml-auto text-sm">{withdrawal.processingTime}</div>
                          )}
                        </div>
                        {withdrawal.status === 'completed' && (
                          <div className="flex items-center gap-2 text-[#02C076]">
                            <CheckCircleIcon className="h-5 w-5" />
                            <span>Completed</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-4 bg-[#1E2329] rounded-lg p-4">
                    <div>
                      <div className="text-sm text-[#848E9C] mb-1">Network</div>
                      <div className="text-white font-medium">{withdrawal.network}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#848E9C] mb-1">Address</div>
                      <div className="text-white font-mono break-all">{withdrawal.address}</div>
                    </div>
                    {withdrawal.txId && (
                      <div>
                        <div className="text-sm text-[#848E9C] mb-1">Transaction ID</div>
                        <div className="text-white font-mono break-all">{withdrawal.txId}</div>
                      </div>
                    )}
                    
                    {/* Financial Details */}
                    <div className="pt-4 border-t border-[#2E353F] space-y-3">
                      <div className="flex justify-between">
                        <div className="text-sm text-[#848E9C]">Amount</div>
                        <div className="text-white font-medium">{withdrawal.amount} {withdrawal.coin}</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm text-[#848E9C]">Network Fee</div>
                        <div className="text-white">{withdrawal.fee} {withdrawal.coin}</div>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-[#2E353F]">
                        <div className="text-sm text-[#848E9C]">You Will Receive</div>
                        <div className="text-white font-medium">{getReceivedAmount()} {withdrawal.coin}</div>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Time Info */}
                  {withdrawal.status === 'pending' && (
                    <div className="flex items-start gap-3 bg-[#F0B90B]/10 text-[#F0B90B] p-4 rounded-lg">
                      <ClockIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Processing</div>
                        <div className="text-sm mt-1">
                          Estimated arrival: {withdrawal.estimatedArrivalTime || 'Within 30 minutes'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {withdrawal.status === 'failed' && (
                    <div className="flex items-start gap-3 bg-[#CD6D6D]/10 text-[#CD6D6D] p-4 rounded-lg">
                      <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Withdrawal Failed</div>
                        <div className="text-sm mt-1">Please contact support if you need assistance.</div>
                      </div>
                    </div>
                  )}

                  {/* Support Note */}
                  <div className="text-sm text-[#848E9C] p-4 bg-[#1E2329] rounded-lg">
                    <p>Need help? Contact our 24/7 customer support for assistance with your withdrawal.</p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default function WithdrawalHistory({ isOpen, onClose }: WithdrawalHistoryProps) {
  const dispatch = useDispatch();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRecord | null>(null);
  
  const { withdrawalHistory, loading, error } = useSelector((state: RootState) => state.public.withdrawal);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchWithdrawalHistory());
    }
  }, [isOpen, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchWithdrawalHistory());
  };

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
                      <Dialog.Title as="h3" className="text-xl font-semibold text-white">
                        Withdrawal History
                      </Dialog.Title>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleRefresh}
                          className="rounded-lg p-1.5 text-[#1E2329] bg-[#F0B90B] hover:bg-[#F0B90B]/80 focus:outline-none transition-all"
                        >
                          <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-lg p-1.5 text-[#1E2329] bg-[#F0B90B] hover:bg-[#F0B90B]/80 focus:outline-none transition-all"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="h-[calc(100vh-70px)] sm:h-[600px] overflow-y-auto">
                    <div className="p-4 sm:p-6">
                      {error && (
                        <div className="text-[#CD6D6D] bg-[#CD6D6D]/10 p-4 rounded-lg mb-4">
                          {error}
                        </div>
                      )}
                      
                      {loading && withdrawalHistory.length === 0 ? (
                        <div className="flex items-center justify-center h-32">
                          <ArrowPathIcon className="h-8 w-8 text-[#F0B90B] animate-spin" />
                        </div>
                      ) : withdrawalHistory.length === 0 ? (
                        <div className="text-center text-[#848E9C] py-8">
                          No withdrawal history found
                        </div>
                      ) : (
                        <div className="divide-y divide-[#2B3139]">
                          {withdrawalHistory.map((withdrawal: WithdrawalRecord) => (
                            <button
                              key={withdrawal.id}
                              onClick={() => setSelectedWithdrawal(withdrawal)}
                              className="w-full text-left hover:bg-[#2B3139] py-4 transition-all duration-200 group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 relative mr-3">
                                    <Image
                                      src={withdrawal?.icon}
                                      alt={withdrawal.coin}
                                      width={32}
                                      height={32}
                                      className="rounded-full"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="text-[#EAECEF] font-medium">
                                      Withdraw {withdrawal.coin}
                                    </h4>
                                    <p className="text-xs text-[#848E9C]">
                                      {withdrawal.timestamp}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <StatusBadge status={withdrawal?.status} />
                                  <ChevronRightIcon className="h-5 w-5 text-[#848E9C]" />
                                </div>
                              </div>

                              <div className="mt-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-[#848E9C]">Amount</span>
                                  <span className="text-[#EAECEF]">
                                    {withdrawal.amount} {withdrawal.coin}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm mt-0.5">
                                  <span className="text-[#848E9C]">Network</span>
                                  <span className="text-[#EAECEF]">
                                    {withdrawal.network}
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {selectedWithdrawal && (
        <WithdrawalDetails
          isOpen={!!selectedWithdrawal}
          onClose={() => setSelectedWithdrawal(null)}
          withdrawal={selectedWithdrawal}
        />
      )}
    </>
  );
} 