'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Menu , Divider } from 'antd';
import {
  RedoOutlined,
  DashboardOutlined,
  UserOutlined,
  WalletOutlined,
  CreditCardOutlined,
  SettingOutlined,
  BellOutlined,
  TeamOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchDashboardStatsRequest, fetchRecentActivitiesRequest } from '../store/slices/adminSlice';

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  
  const { stats, recentActivities, loading } = useAppSelector(state => state.admin);
 

  useEffect(() => {
    dispatch(fetchDashboardStatsRequest());
    dispatch(fetchRecentActivitiesRequest());
  }, [dispatch]);

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

  const handleRefresh = () => {
    dispatch(fetchDashboardStatsRequest());
    dispatch(fetchRecentActivitiesRequest());
  };
  
  return (
    <>
      <div className="dark:bg-gray-900 bg-amber-50">
        <div className="min-h-screen text-gray-100">
          <aside className="fixed inset-y-0 left-0 bg-gray-800 w-64">
        <Divider />
        <Divider />
        <Divider />
        <Divider />
            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              style={{ background: 'transparent', border: 'none' }}
              className="mt-5 text-gray-300"
              onClick={({ key }) => router.push(key)}
              items={menuItems}
              theme="dark"
            />
          </aside>

          <main className="ml-64 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                <DashboardOutlined className="mr-3 text-blue-500" />
                Dashboard Overview
              </h1>
              <div className="flex space-x-4">
                <Button
                  icon={<RedoOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                  className="bg-gray-700 text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 border border-gray-600 shadow-lg"
                >
                  Refresh
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
                      <WalletOutlined className="text-green-500 text-2xl" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-gray-300 text-sm font-medium uppercase tracking-wider">Total Withdrawals</h2>
                      <p className="text-3xl font-bold text-white mt-1">{stats.totalWithdrawals}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-500 bg-opacity-10 ring-2 ring-yellow-500 ring-opacity-40">
                      <HistoryOutlined className="text-yellow-500 text-2xl" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-gray-300 text-sm font-medium uppercase tracking-wider">Pending Withdrawals</h2>
                      <p className="text-3xl font-bold text-white mt-1">{stats.pendingWithdrawals}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-500 bg-opacity-10 ring-2 ring-purple-500 ring-opacity-40">
                      <TeamOutlined className="text-purple-500 text-2xl" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-gray-300 text-sm font-medium uppercase tracking-wider">New Users Today</h2>
                      <p className="text-3xl font-bold text-white mt-1">{stats.newUsersLast24h}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push('/admin/users')}
                    className="flex items-center p-5 bg-gray-700 rounded-xl hover:bg-gray-600 text-gray-200 border border-gray-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group"
                  >
                    <div className="p-2 rounded-lg bg-blue-500 bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200">
                      <UserOutlined className="text-blue-500 text-xl" />
                    </div>
                    <span className="ml-3 font-medium">Manage Users</span>
                  </button>
                  <button
                    onClick={() => router.push('/admin/withdrawals')}
                    className="flex items-center p-5 bg-gray-700 rounded-xl hover:bg-gray-600 text-gray-200 border border-gray-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group"
                  >
                    <div className="p-2 rounded-lg bg-green-500 bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200">
                      <WalletOutlined className="text-green-500 text-xl" />
                    </div>
                    <span className="ml-3 font-medium">Process Withdrawals</span>
                  </button>
                  <button
                    onClick={() => router.push('/admin/settings')}
                    className="flex items-center p-5 bg-gray-700 rounded-xl hover:bg-gray-600 text-gray-200 border border-gray-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group"
                  >
                    <div className="p-2 rounded-lg bg-gray-500 bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200">
                      <SettingOutlined className="text-gray-400 text-xl" />
                    </div>
                    <span className="ml-3 font-medium">Settings</span>
                  </button>
                  <button
                    onClick={() => router.push('/admin/history')}
                    className="flex items-center p-5 bg-gray-700 rounded-xl hover:bg-gray-600 text-gray-200 border border-gray-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group"
                  >
                    <div className="p-2 rounded-lg bg-purple-500 bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200">
                      <HistoryOutlined className="text-purple-500 text-xl" />
                    </div>
                    <span className="ml-3 font-medium">History</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-100 flex items-center">
                  <HistoryOutlined className="mr-2 text-gray-400" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 group">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-1 ring-4 ring-green-500 ring-opacity-20"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">{activity.details}</p>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivities.length === 0 && (
                    <div className="text-gray-500 text-sm flex items-center justify-center p-4 border border-dashed border-gray-700 rounded-lg">
                      <HistoryOutlined className="mr-2" /> No recent activities
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
