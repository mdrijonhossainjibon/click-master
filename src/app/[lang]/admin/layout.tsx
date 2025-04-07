'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  DashboardOutlined,
  UserOutlined,
  WalletOutlined,
  CreditCardOutlined,
  BellOutlined,
  TeamOutlined,
  SettingOutlined,
  HistoryOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useSession } from "next-auth/react"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  

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
      key: '/admin/wallet',
      icon: <WalletOutlined />,
      label: 'Hot Wallet'
    },
    {
      key: '/admin/ads-config',
      icon: <AppstoreOutlined />,
      label: 'Ads Config'
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

  const { data: session, status } = useSession()
 
   
  
  return (
    <div className='bg-[#0B1120]  ' >
      <div className="min-h-screen">
        <div className="min-h-screen text-gray-100 flex ">
          <aside className="fixed inset-y-0 left-0 bg-[#0B1120] w-[200px] border-r border-[#1B2B4B] shadow-lg ">
            <nav className="py-4">
              {status === "authenticated" && menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => router.push(item.key)}
                  className={`w-full flex items-center px-4 py-2.5 text-left transition-all duration-200
                    ${pathname === item.key
                      ? 'bg-[#0051FF] text-white'
                      : 'text-gray-400 hover:bg-[#162036] hover:text-gray-200'}`}
                >
                  <span className={`text-lg mr-3 ${pathname === item.key ? 'text-white' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="ml-[200px] w-full bg-[#0B1120]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
