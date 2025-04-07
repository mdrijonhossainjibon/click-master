'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  RedoOutlined,
  DashboardOutlined,
  UserOutlined,
  WalletOutlined,
  CreditCardOutlined,
  SettingOutlined,
  BellOutlined,
  TeamOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { API_CALL } from '@/lib/client';

interface Withdrawal {
  _id: string;
  userId: {
    email: string;
   username: string;
  };
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  method: string;
   
  
}

export default function WithdrawalsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    API_CALL({ url: '/withdrawals' })
      .then((res) => {
         setWithdrawals(res.response?.result as any);
        console.log(res.response?.result);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    API_CALL({ url: '/withdrawals' })
      .then((res) => {
        setWithdrawals(res.response?.result as any);
        console.log(res.response?.result);
      })
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id: string) => {
    try {
      setLoading(true);
      const { status } = await API_CALL({ 
        url: `/withdrawals/${id}`, 
        method: 'PUT',
        body: { status: 'approved' }
      });
      
      if (status === 200) {
        handleRefresh();
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setLoading(true);
      const { status } = await API_CALL({ 
        url: `/withdrawals/${id}`, 
        method: 'PUT',
        body: { status: 'rejected' }
      });
      
      if (status === 200) {
        handleRefresh();
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/admin/withdrawals/${id}`);
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = (withdrawal.userId.username?.toLowerCase() || withdrawal.userId.email.toLowerCase()).includes(searchTerm.toLowerCase()) ||
                         withdrawal.method.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || withdrawal.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: withdrawals.reduce((sum, w) => sum + w.amount, 0),
    approved: withdrawals.filter(w => w.status === 'approved').length,
    pending: withdrawals.filter(w => w.status === 'pending').length
  };

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Users'
    },
    {
      key: '/admin/withdrawals',
      icon: <WalletOutlined />,
      label: 'Withdrawals'
    },
    {
      key: '/admin/payment-methods',
      icon: <CreditCardOutlined />,
      label: 'Payment Methods'
    },
    {
      key: '/admin/notifications',
      icon: <BellOutlined />,
      label: 'Notifications'
    },
    {
      key: '/admin/roles',
      icon: <TeamOutlined />,
      label: 'Roles'
    },
    {
      key: '/admin/history',
      icon: <HistoryOutlined />,
      label: 'History'
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings'
    }
  ];

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

  return (
    <div className='bg-gray-900'>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 transition-colors duration-300">
        <div className="min-h-screen text-gray-100">
          <aside className="fixed inset-y-0 left-0 bg-gray-900 w-64 border-r border-gray-700 shadow-lg transition-colors duration-300">
            <nav className="mt-8 px-4">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => router.push(item.key)}
                  className={`w-full flex items-center px-4 py-3 mb-2 rounded-xl text-left transition-all duration-300 ease-in-out
                    ${pathname === item.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  <span className={`text-xl mr-4 ${pathname === item.key ? 'text-white' : 'text-blue-400'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="ml-64 p-8">
            <div className="flex justify-between items-center mb-8 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 transition-all duration-300">
              <h1 className="text-2xl font-bold text-gray-100 flex items-center">
                <WalletOutlined className="mr-3 text-blue-400" />
                Withdrawals Management
              </h1>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/admin')}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 shadow-md"
                >
                  <DashboardOutlined />
                  Dashboard
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow-md
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
                >
                  <RedoOutlined className={`${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex items-center">
                  <div className="p-4 rounded-xl bg-blue-900/20 group-hover:bg-blue-900/40 transition-all duration-300">
                    <WalletOutlined className="text-blue-400 text-2xl group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Withdrawals</h2>
                    <p className="text-3xl font-bold text-white mt-1">${stats.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex items-center">
                  <div className="p-4 rounded-xl bg-green-900/20 group-hover:bg-green-900/40 transition-all duration-300">
                    <CheckCircleOutlined className="text-green-400 text-2xl group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Approved</h2>
                    <p className="text-3xl font-bold text-white mt-1">{stats.approved}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex items-center">
                  <div className="p-4 rounded-xl bg-yellow-900/20 group-hover:bg-yellow-900/40 transition-all duration-300">
                    <ClockCircleOutlined className="text-yellow-400 text-2xl group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pending</h2>
                    <p className="text-3xl font-bold text-white mt-1">{stats.pending}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-100">Recent Withdrawals</h2>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  <div className="relative flex-grow md:flex-grow-0 md:min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Search withdrawals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-800">
                      <th className="pb-4 text-gray-400 font-medium">User</th>
                      <th className="pb-4 text-gray-400 font-medium">Amount</th>
                      <th className="pb-4 text-gray-400 font-medium">Payment Method</th>
                      <th className="pb-4 text-gray-400 font-medium">Status</th>
                      <th className="pb-4 text-gray-400 font-medium">Date</th>
                      <th className="pb-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredWithdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          {searchTerm || selectedStatus !== 'all' ? 'No matching withdrawals found' : 'No withdrawals found'}
                        </td>
                      </tr>
                    ) : (
                      filteredWithdrawals.map((withdrawal) => (
                        <tr key={withdrawal._id} className="hover:bg-gray-800/50 transition-colors duration-200">
                          <td className="py-4 px-2">
                            <div className="flex flex-col">
                              <span className="font-medium">{withdrawal.userId.username}</span>
                              <span className="text-sm text-gray-400">{withdrawal.userId.email}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <span className="font-medium text-green-400">${withdrawal.amount.toFixed(2)}</span>
                          </td>
                          <td className="py-4 px-2">
                            <span className="px-3 py-1 bg-gray-800 rounded-lg text-sm">{withdrawal.method}</span>
                          </td>
                          <td className="py-4 px-2">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                              withdrawal.status === 'approved' ? 'bg-green-900/20 text-green-400' :
                              withdrawal.status === 'rejected' ? 'bg-red-900/20 text-red-400' :
                              'bg-yellow-900/20 text-yellow-400'
                            }`}>
                              {getStatusIcon(withdrawal.status)}
                              {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex flex-col">
                              <span className="font-medium">{new Date(withdrawal.createdAt).toLocaleDateString()}</span>
                              <span className="text-sm text-gray-400">{new Date(withdrawal.createdAt).toLocaleTimeString()}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex gap-2">
                              {withdrawal.status === 'pending' && (
                                <>
                                  <button
                                    className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                    onClick={() => handleApprove(withdrawal._id)}
                                    disabled={loading}
                                  >
                                    {loading ? 'Processing...' : 'Approve'}
                                  </button>
                                  <button
                                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                    onClick={() => handleReject(withdrawal._id)}
                                    disabled={loading}
                                  >
                                    {loading ? 'Processing...' : 'Reject'}
                                  </button>
                                  <button
                                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                    onClick={() => handleViewDetails(withdrawal._id)}
                                  >
                                    Details
                                  </button>
                                </>
                              )}
                              {withdrawal.status !== 'pending' && (
                                <div className="flex gap-2">
                                  <span className="text-sm text-gray-400">
                                    {withdrawal.status === 'approved' ? 'Approved' : 'Rejected'}
                                  </span>
                                  <button
                                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                    onClick={() => handleViewDetails(withdrawal._id)}
                                  >
                                    Details
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
