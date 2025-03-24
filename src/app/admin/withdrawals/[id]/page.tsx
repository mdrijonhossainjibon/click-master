'use client';

import { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Space, Tag, Descriptions, Timeline, Button, Menu, Statistic } from 'antd';
import { DashboardOutlined, TeamOutlined, HistoryOutlined, WalletOutlined, SettingOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { api } from '@/app/services/api';

const { Content, Sider } = Layout;

interface WithdrawalDetails {
    id: string;
    user: {
        fullName: string;
        telegramId: string;
        email: string;
    };
    amount: number;
    network: string;
    walletAddress: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    createdAt: string;
    updatedAt: string;
    notes?: string;
    history: Array<{
        status: string;
        timestamp: string;
        note?: string;
    }>;
}

export default function WithdrawalDetails({ params }: { params: any }) {
    const [loading, setLoading] = useState(false);
    const [withdrawal, setWithdrawal] = useState<WithdrawalDetails | null>(null);
    const [collapsed, setCollapsed] = useState(false);

    const fetchWithdrawalDetails = async () => {
        try {
            setLoading(true);
            // const response = await api.getWithdrawalDetails(params.id);
            // setWithdrawal(response.data);
            // Mock data for development
            setWithdrawal({
                id: params.id,
                user: {
                    fullName: 'John Doe',
                    telegramId: 'johndoe123',
                    email: 'john@example.com'
                },
                amount: 100.00,
                network: 'USDT (TRC20)',
                walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                notes: 'First time withdrawal',
                history: [
                    {
                        status: 'pending',
                        timestamp: new Date().toISOString(),
                        note: 'Withdrawal request submitted'
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching withdrawal details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            // await api.updateWithdrawalStatus(params.id, newStatus);
            fetchWithdrawalDetails();
        } catch (error) {
            console.error('Error updating withdrawal status:', error);
        }
    };

    useEffect(() => {
        fetchWithdrawalDetails();
    }, [params.id]);

    const statusColors = {
        pending: 'warning',
        approved: 'processing',
        completed: 'success',
        rejected: 'error'
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light">
                <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}>
                    {!collapsed ? 'ClickMaster' : 'CM'}
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['withdrawals']}
                    defaultOpenKeys={['sub2']}
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
                    {withdrawal && (
                        <>
                            <Row gutter={[24, 24]}>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Amount"
                                            value={withdrawal.amount}
                                            precision={2}
                                            prefix="$"
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Status"
                                            value={withdrawal.status.toUpperCase()}
                                            valueStyle={{ color: statusColors[withdrawal.status] === 'success' ? '#3f8600' : '#cf1322' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Network"
                                            value={withdrawal.network}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Request Date"
                                            value={new Date(withdrawal.createdAt).toLocaleDateString()}
                                            prefix={<ClockCircleOutlined />}
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            <Card title="Withdrawal Details" className="mt-6">
                                <Descriptions bordered>
                                    <Descriptions.Item label="User Name" span={2}>{withdrawal.user.fullName}</Descriptions.Item>
                                    <Descriptions.Item label="Telegram ID">@{withdrawal.user.telegramId}</Descriptions.Item>
                                    <Descriptions.Item label="Email" span={2}>{withdrawal.user.email}</Descriptions.Item>
                                    <Descriptions.Item label="Status">
                                        <Tag color={statusColors[withdrawal.status]}>
                                            {withdrawal.status.toUpperCase()}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Wallet Address" span={3}>
                                        <span className="font-mono">{withdrawal.walletAddress}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Notes" span={3}>{withdrawal.notes || 'No notes'}</Descriptions.Item>
                                </Descriptions>

                                {withdrawal.status === 'pending' && (
                                    <div className="mt-4">
                                        <Space>
                                            <Button type="primary" onClick={() => handleStatusUpdate('approved')}>Approve</Button>
                                            <Button danger onClick={() => handleStatusUpdate('rejected')}>Reject</Button>
                                        </Space>
                                    </div>
                                )}
                            </Card>

                            <Card title="Status History" className="mt-6">
                                <Timeline
                                    items={withdrawal.history.map(item => ({
                                        color: statusColors[item.status as keyof typeof statusColors],
                                        children: (
                                            <>
                                                <p><strong>{item.status.toUpperCase()}</strong></p>
                                                <p>{new Date(item.timestamp).toLocaleString()}</p>
                                                {item.note && <p className="text-gray-500">{item.note}</p>}
                                            </>
                                        )
                                    }))}
                                />
                            </Card>
                        </>
                    )}
                </div>
            </Layout>
        </Layout>
    );
}