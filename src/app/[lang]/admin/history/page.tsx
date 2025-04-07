'use client';

import { useEffect, useState } from 'react';
import { Layout, Table, Button, Input, Select, Card, Row, Col, Space, Tag, Statistic, Menu } from 'antd';
import { DashboardOutlined, TeamOutlined, HistoryOutlined, WalletOutlined, SettingOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { api } from '@/app/services/api';

const { Content, Sider } = Layout;
const { Option } = Select;

interface Activity {
    id: string;
    userId: string;
    userName: string;
    action: string;
    details: string;
    ipAddress: string;
    createdAt: string;
}

export default function ActivityHistory() {
    const [selectedAction, setSelectedAction] = useState<string>('all');
    const [selectedDate, setSelectedDate] = useState<string>('all');
    const [searchText, setSearchText] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [collapsed, setCollapsed] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const [stats, setStats] = useState({
        totalActivities: 0,
        todayActivities: 0,
        uniqueUsers: 0
    });

    const columns = [
        {
            title: 'User',
            dataIndex: 'userName',
            key: 'userName',
            className: 'text-sm'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            className: 'text-sm',
            render: (action: string) => {
                const actionColors = {
                    login: 'blue',
                    logout: 'default',
                    withdrawal: 'green',
                    deposit: 'gold',
                    update: 'purple'
                };
                return (
                    <Tag color={actionColors[action as keyof typeof actionColors] || 'default'}>
                        {action.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Details',
            dataIndex: 'details',
            key: 'details',
            className: 'text-sm'
        },
        {
            title: 'IP Address',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
            className: 'text-sm',
            render: (ip: string) => (
                <span className="font-mono">{ip}</span>
            )
        },
        {
            title: 'Time',
            dataIndex: 'createdAt',
            key: 'createdAt',
            className: 'text-sm',
            render: (date: string) => new Date(date).toLocaleString()
        }
    ];

    const fetchActivities = async () => {
        try {
            setLoading(true);
           /*  const response = await api.getActivities({
                action: selectedAction !== 'all' ? selectedAction : undefined,
                dateRange: selectedDate !== 'all' ? selectedDate : undefined,
                search: searchText || undefined,
                page: pagination.current,
                pageSize: pagination.pageSize
            });

            setActivities(response.data);
            setPagination(prev => ({
                ...prev,
                total: response.total
            })); */
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            /* const stats = await api.getActivityStats();
            setStats(stats); */
        } catch (error) {
            console.error('Error fetching activity stats:', error);
        }
    };

    useEffect(() => {
        fetchActivities();
        fetchStats();
    }, [selectedAction, selectedDate, searchText, pagination.current, pagination.pageSize]);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light">
                <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}>
                    {!collapsed ? 'ClickMaster' : 'CM'}
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['history']}
                    defaultOpenKeys={['sub1', 'sub2']}
                    style={{ borderRight: 0 }}
                    items={[
                        {
                            key: 'dashboard',
                            icon: <DashboardOutlined />,
                            label: 'Dashboard',
                        },
                        {
                            key: 'sub1',
                            icon: <TeamOutlined />,
                            label: 'User Management',
                            children: [
                                {
                                    key: 'users',
                                    label: 'All Users',
                                },
                                {
                                    key: 'roles',
                                    label: 'Roles & Permissions',
                                },
                                {
                                    key: 'invites',
                                    label: 'User Invitations',
                                },
                            ],
                        },
                        {
                            key: 'sub2',
                            icon: <WalletOutlined />,
                            label: 'Financial',
                            children: [
                                {
                                    key: 'transactions',
                                    label: 'Transactions',
                                },
                                {
                                    key: 'withdrawals',
                                    label: 'Withdrawals',
                                },
                                {
                                    key: 'reports',
                                    label: 'Financial Reports',
                                },
                            ],
                        },
                        {
                            key: 'history',
                            icon: <HistoryOutlined />,
                            label: 'Activity History',
                        },
                        {
                            key: 'settings',
                            icon: <SettingOutlined />,
                            label: 'Settings',
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <div className="p-6">
                    <Card bordered={false} className="mb-6">
                        <Row gutter={24}>
                            <Col span={8}>
                                <Statistic
                                    title="Total Activities"
                                    value={stats.totalActivities}
                                    prefix={<HistoryOutlined />}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Today's Activities"
                                    value={stats.todayActivities}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Unique Users"
                                    value={stats.uniqueUsers}
                                    prefix={<TeamOutlined />}
                                />
                            </Col>
                        </Row>
                    </Card>

                    <Card bordered={false}>
                        <div className="mb-4 flex justify-between items-center">
                            <Space>
                                <Select
                                    value={selectedAction}
                                    onChange={setSelectedAction}
                                    style={{ width: 120 }}
                                >
                                    <Option value="all">All Actions</Option>
                                    <Option value="login">Login</Option>
                                    <Option value="logout">Logout</Option>
                                    <Option value="withdrawal">Withdrawal</Option>
                                    <Option value="deposit">Deposit</Option>
                                    <Option value="update">Update</Option>
                                </Select>
                                <Select
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    style={{ width: 120 }}
                                >
                                    <Option value="all">All Time</Option>
                                    <Option value="today">Today</Option>
                                    <Option value="week">This Week</Option>
                                    <Option value="month">This Month</Option>
                                </Select>
                                <Input
                                    placeholder="Search user or action"
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    prefix={<SearchOutlined />}
                                    style={{ width: 200 }}
                                />
                            </Space>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={activities}
                            rowKey="id"
                            loading={loading}
                            pagination={pagination}
                            
                        />
                    </Card>
                </div>
            </Layout>
        </Layout>
    );
}