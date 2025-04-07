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
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { API_CALL } from '@/lib/client';
import Image from 'next/image';

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: string;
  status: string;
  minimumAmount: number;
  maximumAmount: number;
  processingTime: string;
  fees: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PaymentMethod, 'id'>) => void;
  initialData?: PaymentMethod;
  mode?: 'add' | 'edit';
}

const PaymentMethodModal = ({ isOpen, onClose, onSubmit, initialData, mode = 'add' }: ModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'mobile_banking',
    icon: '',
    status: 'active',
    minimumAmount: 0,
    maximumAmount: 0,
    processingTime: '',
    fees: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (mode === 'add') {
      setFormData({
        name: '',
        type: 'mobile_banking',
        icon: '',
        status: 'active',
        minimumAmount: 0,
        maximumAmount: 0,
        processingTime: '',
        fees: ''
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <CloseOutlined />
        </button>
        <h2 className="text-xl font-semibold text-white mb-6">
          {mode === 'add' ? 'Add New Payment Method' : 'Edit Payment Method'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mobile_banking">Mobile Banking</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Icon URL</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="/images/example.png"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Min Amount</label>
              <input
                type="number"
                value={formData.minimumAmount}
                onChange={(e) => setFormData({ ...formData, minimumAmount: Number(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Max Amount</label>
              <input
                type="number"
                value={formData.maximumAmount}
                onChange={(e) => setFormData({ ...formData, maximumAmount: Number(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Processing Time</label>
            <input
              type="text"
              value={formData.processingTime}
              onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="1-2 hours"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Fees</label>
            <input
              type="text"
              value={formData.fees}
              onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="1.5%"
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              {mode === 'add' ? 'Add Method' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  methodName: string;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, methodName }: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <div className="text-center">
          <ExclamationCircleOutlined className="text-4xl text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Delete Payment Method</h3>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete <span className="font-semibold">{methodName}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PaymentMethodsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    setLoading(true);
    API_CALL({ url: '/payment-methods' })
      .then((res) => {
        setPaymentMethods(res.response?.result as any);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    API_CALL({ url: '/payment-methods' })
      .then((res) => {
        setPaymentMethods(res.response?.result as any);
      })
      .finally(() => setLoading(false));
  };

  const handleAddPaymentMethod = async (data: Omit<PaymentMethod, 'id'>) => {
    setLoading(true);
    try {
      const response = await API_CALL({
        url: '/payment-methods',
        method: 'POST',
        body: data
      });
      if (response.response) {
        handleRefresh();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPaymentMethod = async (data: Omit<PaymentMethod, 'id'>) => {
    if (!selectedMethod) return;
    
    setLoading(true);
    try {
      const response = await API_CALL({
        url: `/payment-methods/${selectedMethod.id}`,
        method: 'PUT',
        body: data
      });
      if (response.response) {
        handleRefresh();
        setIsModalOpen(false);
        setSelectedMethod(null);
      }
    } catch (error) {
      console.error('Error updating payment method:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = async () => {
    if (!selectedMethod) return;
    
    setLoading(true);
    try {
      const response = await API_CALL({
        url: `/payment-methods/${selectedMethod.id}`,
        method: 'DELETE'
      });
      if (response.response) {
        handleRefresh();
        setIsDeleteModalOpen(false);
        setSelectedMethod(null);
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const openDeleteModal = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsDeleteModalOpen(true);
  };

  const filteredPaymentMethods = paymentMethods.filter(method => {
    const matchesSearch = method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         method.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || method.type === selectedType;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: paymentMethods.length,
    active: paymentMethods.filter(m => m.status === 'active').length,
    crypto: paymentMethods.filter(m => m.type === 'crypto').length,
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
                <CreditCardOutlined className="mr-3 text-blue-400" />
                Payment Methods Management
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
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 shadow-md"
                >
                  <PlusOutlined />
                  Add New
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
                    <CreditCardOutlined className="text-blue-400 text-2xl group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Methods</h2>
                    <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex items-center">
                  <div className="p-4 rounded-xl bg-green-900/20 group-hover:bg-green-900/40 transition-all duration-300">
                    <CheckCircleOutlined className="text-green-400 text-2xl group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Active Methods</h2>
                    <p className="text-3xl font-bold text-white mt-1">{stats.active}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex items-center">
                  <div className="p-4 rounded-xl bg-purple-900/20 group-hover:bg-purple-900/40 transition-all duration-300">
                    <i className="fab fa-bitcoin text-purple-400 text-2xl group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Crypto Methods</h2>
                    <p className="text-3xl font-bold text-white mt-1">{stats.crypto}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-100">Payment Methods</h2>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  <div className="relative flex-grow md:flex-grow-0 md:min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Search methods..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Types</option>
                    <option value="mobile_banking">Mobile Banking</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPaymentMethods.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-gray-500">
                    {searchTerm || selectedType !== 'all' ? 'No matching payment methods found' : 'No payment methods found'}
                  </div>
                ) : (
                  filteredPaymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-700">
                            <Image
                              src={method.icon}
                              alt={method.name}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-semibold text-lg text-white">{method.name}</h3>
                            <span className="text-sm text-gray-400 capitalize">{method.type.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(method)}
                            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <EditOutlined />
                          </button>
                          <button
                            onClick={() => openDeleteModal(method)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className={`px-2 py-1 rounded-lg ${
                            method.status === 'active' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                          }`}>
                            {method.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Min Amount</span>
                          <span className="text-white">${method.minimumAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Max Amount</span>
                          <span className="text-white">${method.maximumAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Processing Time</span>
                          <span className="text-white">{method.processingTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fees</span>
                          <span className="text-white">{method.fees}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <PaymentMethodModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedMethod(null);
                setModalMode('add');
              }}
              onSubmit={modalMode === 'add' ? handleAddPaymentMethod : handleEditPaymentMethod}
              initialData={selectedMethod || undefined}
              mode={modalMode}
            />
            <DeleteConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedMethod(null);
              }}
              onConfirm={handleDeletePaymentMethod}
              methodName={selectedMethod?.name || ''}
            />
          </main>
        </div>
      </div>
    </div>
  );
} 