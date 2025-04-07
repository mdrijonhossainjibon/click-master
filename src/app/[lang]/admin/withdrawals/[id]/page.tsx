'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_CALL } from '@/lib/client';
import Image from 'next/image';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  WalletOutlined,
  CalendarOutlined,
  DollarOutlined,
  CopyOutlined,
  CheckOutlined,
  GlobalOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';

interface WithdrawalDetails {
  id: string;
  userId: {
    email: string;
    username: string;
  };
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  method: string;
  recipient: string;
  network?: string;
}

export default function WithdrawalDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [withdrawal, setWithdrawal] = useState<WithdrawalDetails | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      API_CALL({ url: `/withdrawals/${params.id}` })
        .then((res) => {
          setWithdrawal(res.response?.result as any);
        })
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  const handleApprove = async () => {
    Modal.confirm({
      title: 'Confirm Approval',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      content: 'Are you sure you want to approve this withdrawal request?',
      okText: 'Yes, Approve',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          const { status } = await API_CALL({ 
            url: `/withdrawals/${params.id}`, 
            method: 'PUT',
            body: { status: 'approved' }
          });
          
          if (status === 200) {
            router.refresh();
          }
        } catch (error) {
          console.error('Error approving withdrawal:', error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleReject = async () => {
    Modal.confirm({
      title: 'Confirm Rejection',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: 'Are you sure you want to reject this withdrawal request?',
      okText: 'Yes, Reject',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          const { status } = await API_CALL({ 
            url: `/withdrawals/${params.id}`, 
            method: 'PUT',
            body: { status: 'rejected' }
          });
          
          if (status === 200) {
            router.refresh();
          }
        } catch (error) {
          console.error('Error rejecting withdrawal:', error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleOutlined className="text-green-400" />;
      case 'rejected':
        return <CloseCircleOutlined className="text-red-400" />;
      default:
        return <ClockCircleOutlined className="text-yellow-400" />;
    }
  };

  const getMethodIcon = (method: string) => {
    const defaultIcon = '/images/default-payment.png';
    switch (method.toLowerCase()) {
      case 'bkash':
        return '/images/bkash.png';
      case 'nagad':
        return '/images/nagad.png';
      case 'binance':
        return '/images/binance.png';
      case 'bitget':
        return '/images/bitget.png';
      default:
        return defaultIcon;
    }
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading || !withdrawal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeftOutlined /> Back to Withdrawals
        </button>

        <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={getMethodIcon(withdrawal.method)}
                  alt={withdrawal.method}
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Withdrawal Details</h1>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(withdrawal.status)}
                  <span className={`font-medium capitalize ${getStatusColor(withdrawal.status)}`}>
                    {withdrawal.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Transaction ID</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs text-gray-300">{withdrawal.id}</code>
                <button
                  onClick={() => handleCopy(withdrawal.id, 'txid')}
                  className="p-1 hover:bg-gray-800 rounded transition-colors"
                >
                  {copiedField === 'txid' ? (
                    <CheckOutlined className="text-green-400" />
                  ) : (
                    <CopyOutlined className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <UserOutlined /> User Information
                </h2>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-white font-medium">{withdrawal.userId.username}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-400">{withdrawal.userId.email}</p>
                    <button
                      onClick={() => handleCopy(withdrawal.userId.email, 'email')}
                      className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                    >
                      {copiedField === 'email' ? (
                        <CheckOutlined className="text-green-400" />
                      ) : (
                        <CopyOutlined className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <WalletOutlined /> Payment Details
                </h2>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium capitalize">{withdrawal.method}</p>
                    {withdrawal.network && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                        {withdrawal.network.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 break-all">{withdrawal.recipient}</p>
                    <button
                      onClick={() => handleCopy(withdrawal.recipient, 'recipient')}
                      className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                    >
                      {copiedField === 'recipient' ? (
                        <CheckOutlined className="text-green-400" />
                      ) : (
                        <CopyOutlined className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <DollarOutlined /> Amount
                </h2>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-green-400 text-2xl font-bold">${withdrawal.amount.toFixed(2)}</p>
                    {withdrawal.method.toLowerCase() === 'binance' && (
                      <a
                        href={`https://www.binance.com/en/my/wallet/account/payment/send-crypto/${withdrawal.recipient}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                      >
                        <GlobalOutlined /> View on Binance
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <CalendarOutlined /> Date & Time
                </h2>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-white">{new Date(withdrawal.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-400">{new Date(withdrawal.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>

          {withdrawal.status === 'pending' && (
            <div className="mt-8 flex gap-4 justify-end">
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <CheckCircleOutlined />
                {loading ? 'Processing...' : 'Approve Withdrawal'}
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <CloseCircleOutlined />
                {loading ? 'Processing...' : 'Reject Withdrawal'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 