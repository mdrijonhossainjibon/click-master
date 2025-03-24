'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Button, Input, Select, Space, Tag, Menu, Divider } from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  StopOutlined,
  PlusOutlined,
  DownloadOutlined,
  SearchOutlined,
  DashboardOutlined,
  TeamOutlined,
  HistoryOutlined,
  WalletOutlined,
  SettingOutlined
} from '@ant-design/icons';
import AddUserModal from '@/app/components/modals/AddUserModal';
import { User, UserFilters } from '@/app/services/api';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import {
  fetchUsersRequest,
  createUserRequest,
  updateUserRequest,
  deleteUserRequest,
  fetchStatsRequest
} from '@/app/store/slices/userSlice';

export default function Users() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Get state from Redux
  const { users, loading, total, currentPage, pageSize, error } = useAppSelector(
    (state) => state.user
  );

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: total
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      className: 'text-sm text-gray-300',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: 'text-sm text-gray-300',
    },
    {
      title: 'Telegram ID',
      dataIndex: 'telegramId',
      key: 'telegramId',
      className: 'text-sm text-gray-300',
      //render: (id: string) => `@${id.replace(/^@/, '')}`
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      className: 'text-sm text-gray-300',
      render: (value: number | null) => (
        <span>{value?.toFixed(2) ?? '0.00'}</span>
      ),
      sorter: (a: User, b: User) => (a.balance || 0) - (b.balance || 0),
      width: 100,
    }, {
      title: 'Ads Watched',
      dataIndex: 'adsWatched',
      key: 'adsWatched',
      className: 'text-sm text-gray-300',
      render: (value: number) => (
        <span>{value || 'N/A'}</span>
      ),
      sorter: (a: User, b: User) => (a.adsWatched || 0) - (b.adsWatched || 0),
      width: 120,
    }, 
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      className: 'text-sm text-gray-300',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : role === 'moderator' ? 'blue' : 'default'}>
          {role.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      className: 'text-sm text-gray-300',


      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      className: 'text-sm text-gray-300',
      render: (date: string) => new Date(date).toLocaleDateString()
    }
  ];

  // Get stats from Redux state
  const { stats } = useAppSelector((state) => state.user);

  const fetchUsers = () => {
    const filters: UserFilters = {
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      dateRange: selectedDate !== 'all' ? selectedDate : undefined,
      search: searchText || undefined,
      page: pagination.current,
      pageSize: pagination.pageSize
    };
 
    dispatch(fetchUsersRequest(filters));
  };

  const handleAddSuccess = () => {
      setIsAddModalOpen(false);
      dispatch(fetchStatsRequest());
  };

  

  useEffect(() => {
    fetchUsers()
    //dispatch(fetchStatsRequest());
  }, [selectedStatus, selectedDate, searchText]);

  return (
    <div className="dark:bg-gray-900 bg-amber-50">
      <div className="min-h-screen text-gray-100">
        <aside className="fixed inset-y-0 left-0 bg-gray-800 w-64">
 
        <Divider />
        <Divider />
        <Divider />

          <Menu
            mode="inline"
            selectedKeys={['/admin/users']}
            style={{ background: 'transparent', border: 'none' }}
            className="mt-20 text-gray-300"
            theme="dark"
            items={[
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
            ]}
          />
        </aside>

        <main className="ml-64 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
              <UserOutlined className="mr-3 text-blue-500" />
              User Management
            </h1>
            <div className="flex space-x-4">
              <Button
                icon={<PlusOutlined />}
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gray-700 text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 border border-gray-600 shadow-lg"
              >
                Add User
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-500 bg-opacity-10 ring-2 ring-blue-500 ring-opacity-40">
                    <UserOutlined className="text-blue-500 text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-gray-300 text-sm font-medium uppercase tracking-wider">Total Users</h2>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-500 bg-opacity-10 ring-2 ring-green-500 ring-opacity-40">
                    <CheckCircleOutlined className="text-green-500 text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-gray-300 text-sm font-medium uppercase tracking-wider">Active Users</h2>
                    <p className="text-3xl font-bold text-white mt-1">{stats.activeUsers}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-500 bg-opacity-10 ring-2 ring-red-500 ring-opacity-40">
                    <StopOutlined className="text-red-500 text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-gray-300 text-sm font-medium uppercase tracking-wider">Inactive Users</h2>
                    <p className="text-3xl font-bold text-white mt-1">{stats.inactiveUsers}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-500 bg-opacity-10 ring-2 ring-purple-500 ring-opacity-40">
                    <PlusOutlined className="text-purple-500 text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-gray-300 text-sm font-medium uppercase tracking-wider">New Users Today</h2>
                    <p className="text-3xl font-bold text-white mt-1">{stats.newUsersToday}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
              <Space wrap>
                <Input
                  placeholder="Search users..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                  className="bg-gray-700 text-gray-200 border-gray-600"
                  style={{ width: 200 }}
                />
                <Select
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  style={{ width: 120 }}
                  className="bg-gray-700 text-gray-200"
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                />
                <Select
                  value={selectedDate}
                  onChange={setSelectedDate}
                  style={{ width: 120 }}
                  className="bg-gray-700 text-gray-200"
                  options={[
                    { value: 'all', label: 'All Dates' },
                    { value: 'today', label: 'Today' },
                    { value: 'yesterday', label: 'Yesterday' },
                  ]}
                />
              </Space>
              <Space wrap>
                <Button 
                  icon={<DownloadOutlined />}
                  className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                >
                  Export
                </Button>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                ...pagination,
              }}
              className="user-table"
            />
            {error && (
              <div className="mt-4 text-red-500">
                Error: {error}
              </div>
            )}
          </div>
        </main>
      </div>
      <AddUserModal open={isAddModalOpen} onSuccess={handleAddSuccess} onCancel={() => setIsAddModalOpen(false)} /> 
    </div>
  );
}