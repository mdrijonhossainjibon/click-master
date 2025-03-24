'use client';

import { useState, useEffect } from 'react';
import { Layout, Table, Card, Row, Col, Space, Tag, Select, DatePicker, Input, Button, Menu, Statistic } from 'antd';
import { DashboardOutlined, TeamOutlined, HistoryOutlined, WalletOutlined, SettingOutlined, DollarOutlined } from '@ant-design/icons';
import { api } from '@/app/services/api';

const { Content, Sider } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function WithdrawalsList() {
    const [loading, setLoading] = useState(false);
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: null,
        search: ''
    });
    const [stats, setStats] = useState({
        totalWithdrawals: 0,
        pendingAmount: 0,
        completedAmount: 0,
        todayWithdrawals: 0
    });

    const columns = [
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: (user: any) => (
                <Space direction="vertical" size="small">
                    <span>{user.fullName}</span>
                    <span className="text-gray-500 text-sm">@{user.telegramId}</span>
                </Space>
            )
        },
        {
            title: 'Amount (USD)',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => `$${amount.toFixed(2)}`
        },
        {
            title: 'Wallet Address',
            dataIndex: 'walletAddress',
            key: 'walletAddress',
            width: '25%',
            render: (address: string) => (
                <span className="font-mono text-sm">{address}</span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusColors = {
                    pending: 'processing',
                    approved: 'success',
                    rejected: 'error',
                    completed: 'success'
                };
                return (
                    <Tag color={statusColors[status as keyof typeof statusColors]}>
                        {status.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Requested At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="middle">
                    {record.status === 'pending' && (
                        <>
                            <Button type="primary" size="small" onClick={() => handleApprove(record.id)}>
                                Approve
                            </Button>
                            <Button danger size="small" onClick={() => handleReject(record.id)}>
                                Reject
                            </Button>
                        </>
                    )}
                    <Button type="link" size="small" onClick={() => handleViewDetails(record.id)}>
                        View Details
                    </Button>
                </Space>
            )
        }
    ];

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            // const response = await api.getWithdrawals(filters);
            // setWithdrawals(response.data);
            // Mock data for development
            setWithdrawals([
                {
                    id: 1,
                    user: {
                        fullName: 'John Doe',
                        telegramId: 'johndoe123'
                    },
                    amount: 50.00,
                    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
                    status: 'pending',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    user: {
                        fullName: 'Jane Smith',
                        telegramId: 'janesmith456'
                    },
                    amount: 100.00,
                    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
                    status: 'completed',
                    createdAt: new Date().toISOString()
                }
            ]);
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // const response = await api.getWithdrawalStats();
            // setStats(response.data);
            // Mock data for development
            setStats({
                totalWithdrawals: 150,
                pendingAmount: 500.00,
                completedAmount: 2500.00,
                todayWithdrawals: 5
            });
        } catch (error) {
            console.error('Error fetching withdrawal stats:', error);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            // await api.approveWithdrawal(id);
            fetchWithdrawals();
            fetchStats();
        } catch (error) {
            console.error('Error approving withdrawal:', error);
        }
    };

    const handleReject = async (id: number) => {
        try {
            // await api.rejectWithdrawal(id);
            fetchWithdrawals();
            fetchStats();
        } catch (error) {
            console.error('Error rejecting withdrawal:', error);
        }
    };

    const handleViewDetails = (id: number) => {
        window.location.href = `/admin/withdrawals/${id}`;
    };

    useEffect(() => {
        fetchWithdrawals();
        fetchStats();
    }, [filters]);

    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light">
                <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}>
                    {!collapsed ? 'ClickMaster' : 'CM'}
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['withdrawals']}
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
                    <div className="mb-6">
                        <Row gutter={[24, 24]}>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Total Withdrawals"
                                        value={stats.totalWithdrawals}
                                        prefix={<DollarOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Pending Amount"
                                        value={stats.pendingAmount}
                                        precision={2}
                                        prefix="$"
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Completed Amount"
                                        value={stats.completedAmount}
                                        precision={2}
                                        prefix="$"
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Today's Withdrawals"
                                        value={stats.todayWithdrawals}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <Card bordered={false}>
                        <Row gutter={[16, 16]} className="mb-4">
                            <Col span={8}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Filter by status"
                                    value={filters.status}
                                    onChange={(value) => setFilters({ ...filters, status: value })}
                                >
                                    <Option value="all">All Status</Option>
                                    <Option value="pending">Pending</Option>
                                    <Option value="approved">Approved</Option>
                                    <Option value="rejected">Rejected</Option>
                                    <Option value="completed">Completed</Option>
                                </Select>
                            </Col>
                            <Col span={8}>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    onChange={(dates) => setFilters({ ...filters, dateRange: dates as any })}
                                />
                            </Col>
                            <Col span={8}>
                                <Input
                                    placeholder="Search by user or wallet address"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    prefix={<DollarOutlined />}
                                />
                            </Col>
                        </Row>

                        <Table
                            columns={columns}
                            dataSource={withdrawals}
                            loading={loading}
                            rowKey="id"
                            pagination={{
                                total: withdrawals.length,
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: true
                            }}
                        />
                    </Card>
                </div>
            </Layout>
        </Layout>
    );
}