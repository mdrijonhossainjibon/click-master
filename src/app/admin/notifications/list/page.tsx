'use client';

import { useState, useEffect } from 'react';
import { Layout, Table, Card, Row, Col, Space, Tag, Select, DatePicker, Input, Button, Menu } from 'antd';
import { BellOutlined, CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, InfoCircleOutlined, DashboardOutlined, TeamOutlined, HistoryOutlined, WalletOutlined, SettingOutlined } from '@ant-design/icons';
 

const { Content, Sider } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function NotificationsList() {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        type: 'all',
        status: 'all',
        dateRange: null,
        search: ''
    });

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => {
                const icons = {
                    system: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
                    warning: <WarningOutlined style={{ color: '#faad14' }} />,
                    success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                    info: <InfoCircleOutlined style={{ color: '#1890ff' }} />
                };
                return (
                    <Space>
                        {icons[type as keyof typeof icons]}
                        <span style={{ textTransform: 'capitalize' }}>{type}</span>
                    </Space>
                );
            }
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            width: '40%'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'read' ? 'success' : 'processing'}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button type="link" onClick={() => markAsRead(record.id)}>
                        Mark as Read
                    </Button>
                    <Button type="link" danger onClick={() => deleteNotification(record.id)}>
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            // const response = await api.getNotifications(filters);
            // setNotifications(response.data);
            // Temporary mock data
            setNotifications([
                {
                    id: 1,
                    type: 'system',
                    message: 'System maintenance scheduled for tomorrow',
                    status: 'unread',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    type: 'success',
                    message: 'New user registration completed',
                    status: 'read',
                    createdAt: new Date().toISOString()
                }
            ]);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            // await api.markNotificationAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            // await api.deleteNotification(id);
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
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
                    defaultSelectedKeys={['notifications']}
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
                            key: 'notifications',
                            icon: <BellOutlined />,
                            label: 'Notifications',
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
            <Card bordered={false}>
                <Row gutter={[16, 16]} className="mb-4">
                    <Col span={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Filter by type"
                            value={filters.type}
                            onChange={(value) => setFilters({ ...filters, type: value })}
                        >
                            <Option value="all">All Types</Option>
                            <Option value="system">System</Option>
                            <Option value="warning">Warning</Option>
                            <Option value="success">Success</Option>
                            <Option value="info">Info</Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Filter by status"
                            value={filters.status}
                            onChange={(value) => setFilters({ ...filters, status: value })}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="read">Read</Option>
                            <Option value="unread">Unread</Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <RangePicker
                            style={{ width: '100%' }}
                            onChange={(dates) => setFilters({ ...filters, dateRange: dates as any   })}
                        />
                    </Col>
                    <Col span={6}>
                        <Input
                            placeholder="Search notifications"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            prefix={<InfoCircleOutlined />}
                        />
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={notifications}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        total: notifications.length,
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