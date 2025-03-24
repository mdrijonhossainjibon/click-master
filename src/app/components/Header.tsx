'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '../providers/ThemeProvider';
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Space, Tooltip, message } from 'antd';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import Image from 'next/image';

import {
  SunOutlined,
  MoonOutlined,
  ArrowLeftOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
  MenuOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { signOut } from 'next-auth/react';

// Types
interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onLogout?: () => Promise<void>;
}

interface BreadcrumbItem {
  title: React.ReactNode;
  href: string;
  onClick: (e: React.MouseEvent) => void;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Constants
const HEADER_STYLES = {
  background: '#0A0A0A',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease'
} as const;

const BREADCRUMB_STYLES = {
  background: '#141414',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease'
} as const;

const BUTTON_TEXT_COLOR = 'rgba(255,255,255,0.85)';

// Component
export default function Header({
  title,
  showBackButton = false,
  onLogout
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'New message received',
      message: 'You have a new message from the admin',
      timestamp: new Date(Date.now() - 2 * 60000),
      read: false
    },
    {
      id: '2',
      title: 'Task completed',
      message: 'Your task has been completed successfully',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false
    }
  ]);

  // Memoized menu items
  const userMenuItems: MenuProps['items'] = useMemo(() => [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href="/profile">Profile</Link>
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link href="/settings">Settings</Link>
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick:  () => {
         signOut()
         message.success('Logged out successfully');
      }
    }
  ], [onLogout]);

  const notificationItems: MenuProps['items'] = useMemo(() => 
    notifications.map(notification => ({
      key: notification.id,
      label: (
        <div className="notification-item p-3 hover:bg-gray-800 transition-colors">
          <div className="font-medium">{notification.title}</div>
          <div className="text-sm text-gray-400">{notification.message}</div>
          <div className="text-xs text-gray-500 mt-1">
            {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
              Math.round((notification.timestamp.getTime() - Date.now()) / 60000),
              'minute'
            )}
          </div>
        </div>
      ),
      className: notification.read ? 'read' : 'unread'
    })), 
  [notifications]);

  const navigationItems: MenuProps['items'] = useMemo(() => [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: <Link href="/admin/users">Users</Link>
    },
    {
      key: 'apps',
      icon: <AppstoreOutlined />,
      label: <Link href="/apps">Apps</Link>
    }
  ], []);

  // Handlers
  const handleNavigation = useCallback(async (path: string) => {
    try {
      setIsLoading(true);
      await router.push(path);
    } catch (error) {
      message.error('Navigation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleBack = useCallback(async () => {
    try {
      setIsLoading(true);
      await router.back();
    } catch (error) {
      message.error('Navigation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Breadcrumb generation
  const breadcrumbItems = useMemo(() => {
    const paths = pathname?.split('/').filter(Boolean) || [];
    const items: BreadcrumbItem[] = [
      {
        title: <HomeOutlined />,
        href: '/',
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          handleNavigation('/');
        }
      }
    ];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      items.push({
        title: <span className="capitalize">{path.replace(/-/g, ' ')}</span>,
        href: currentPath,
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          handleNavigation(currentPath);
        }
      });
    });

    return items;
  }, [pathname, handleNavigation]);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length,
  [notifications]);

  return (
    <div className="header-wrapper">
      <header 
        className="site-header sticky top-0 z-50 px-4 md:px-6" 
        style={HEADER_STYLES}
        role="banner"
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2 md:gap-4">
            {showBackButton && (
              <Button 
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                className="header-button hover:opacity-80 transition-opacity"
                style={{ color: BUTTON_TEXT_COLOR }}
                aria-label="Go back"
                loading={isLoading}
              />
            )}
            <h1 className="hidden md:block text-lg font-semibold text-white m-0">
              {title}
            </h1>

            <Dropdown 
              menu={{ items: navigationItems }} 
              placement="bottomLeft"
              trigger={['click']}
            >
              <Button
                type="text"
                icon={<MenuOutlined />}
                className="header-button md:ml-2 hover:opacity-80 transition-opacity"
                style={{ color: BUTTON_TEXT_COLOR }}
                aria-label="Navigation menu"
              />
            </Dropdown>
          </div>

          <div className="flex items-center gap-4">
            <Image
              src="/vercel.svg"
              alt="Company Logo"
              width={32}
              height={32}
              className="hidden md:block hover:opacity-80 transition-opacity"
              priority
            />
          </div>

          <Space size={16} className="items-center ml-auto">
            <Tooltip title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              <Button
                type="text"
                icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                className="header-button hover:opacity-80 transition-opacity"
                style={{ color: BUTTON_TEXT_COLOR }}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              />
            </Tooltip>
            
            <Dropdown 
              menu={{ items: notificationItems }} 
              placement="bottomRight"
              trigger={['click']}
              overlayClassName="notification-dropdown"
            >
              <div className="header-notification">
                <Badge count={unreadCount} size="small">
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    className="header-button hover:opacity-80 transition-opacity"
                    style={{ color: BUTTON_TEXT_COLOR }}
                    aria-label={`${unreadCount} unread notifications`}
                  />
                </Badge>
              </div>
            </Dropdown>

            <Dropdown 
              menu={{ items: userMenuItems }} 
              placement="bottomRight"
              trigger={['click']}
              overlayClassName="user-dropdown"
            >
              <Avatar 
                className="header-avatar cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#1890ff' }}
                icon={<UserOutlined />}
                alt="User avatar"
              />
            </Dropdown>
          </Space>
        </div>
      </header>
      
      <nav className="header-breadcrumb px-4 md:px-6 py-2" style={BREADCRUMB_STYLES} aria-label="Breadcrumb">
        <Breadcrumb items={breadcrumbItems} />
      </nav>
    </div>
  );
}