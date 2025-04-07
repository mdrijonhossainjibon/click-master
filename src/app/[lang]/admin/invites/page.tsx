'use client';

import { useState } from 'react';
import { Layout, Table, Button, Input, Select, Card, Row, Col, Space, Tag, Statistic, Menu, Modal, Form, DatePicker, message } from 'antd';
import { DashboardOutlined, TeamOutlined, HistoryOutlined, WalletOutlined, SettingOutlined, MailOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { api } from '@/app/services/api';

const { Content, Sider } = Layout;
const { Option } = Select;

interface Invitation {
    id: string;
    email: string;
    status: 'pending' | 'accepted' | 'expired';
    createdBy: string;
    createdAt: string;
    expiresAt: string;
}

export default function InvitationsPage() {
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedDate, setSelectedDate] = useState<string>('all');
    const [searchText, setSearchText] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [collapsed, setCollapsed] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [form] = Form.useForm();

    const [stats, setStats] = useState({
        totalInvitations: 0,
        pendingInvitations: 0,
        acceptedInvitations: 0,
        expiredInvitations: 0
    });

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            className: 'text-sm'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            className: 'text-sm',
            render: (status: string) => {
                const statusColors = {
                    pending: 'warning',
                    accepted: 'success',
                    expired: 'error'
                };
                return (
                    <Tag color={statusColors[status as keyof typeof statusColors]}>
                        {status.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
            className: 'text-sm'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            className: 'text-sm',
            render: (date: string) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Expires At',
            dataIndex: 'expiresAt',
            key: 'expiresAt',
            className: 'text-sm',
            render: (date: string) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Actions',
            key: 'actions',
            className: 'text-sm',
            render: (_: any, record: Invitation) => (
                <Space size="middle">
                    {record.status === 'pending' && (
                        <Button type="primary" size="small" onClick={() => handleResendInvitation(record.id)}>
                            Resend
                        </Button>
                    )}
                    <Button danger size="small" onClick={() => handleDeleteInvitation(record.id)}>
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    const fetchInvitations = async () => {
        try {
            setLoading(true);
            const response = await api.getInvitations({
                status: selectedStatus !== 'all' ? selectedStatus : undefined,
                dateRange: selectedDate !== 'all' ? selectedDate : undefined,
                search: searchText || undefined
            });

             
        } catch (error) {
            console.error('Error fetching invitations:', error);
            message.error('Failed to fetch invitations');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            
        } catch (error) {
            console.error('Error fetching invitation stats:', error);
        }
    };

    const handleCreateInvitation = async (values: any) => {
        try {
            setLoading(true);
            await api.createInvitation(values);
            message.success('Invitation sent successfully');
            setIsAddModalVisible(false);
            form.resetFields();
            fetchInvitations();
            fetchStats();
        } catch (error) {
            console.error('Error creating invitation:', error);
            message.error('Failed to send invitation');
        } finally {
            setLoading(false);
        }
    };

    const handleResendInvitation = async (invitationId: string) => {
        try {
            await api.resendInvitation(invitationId);
            message.success('Invitation resent successfully');
            fetchInvitations();
        } catch (error) {
            console.error('Error resending invitation:', error);
            message.error('Failed to resend invitation');
        }
    };

    const handleDeleteInvitation = async (invitationId: string) => {
        try {
            await api.deleteInvitation(invitationId);
            message.success('Invitation deleted successfully');
            fetchInvitations();
            fetchStats();
        } catch (error) {
            console.error('Error deleting invitation:', error);
            message.error('Failed to delete invitation');
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light">
                <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}>
                    {!collapsed ? 'ClickMaster' : 'CM'}
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['invites']}
                    defaultOpenKeys={['sub1']}
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
                    <Row gutter={[24, 24]} className="mb-6">
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Total Invitations"
                                    value={stats.totalInvitations}
                                    prefix={<MailOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Pending Invitations"
                                    value={stats.pendingInvitations}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Accepted Invitations"
                                    value={stats.acceptedInvitations}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Expired Invitations"
                                    value={stats.expiredInvitations}
                                    valueStyle={{ color: '#ff4d4f' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card
                        title="User Invitations"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsAddModalVisible(true)}
                            >
                                Send Invitation
                            </Button>
                        }
                        bordered={false}
                    >
                        <div className="mb-4">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Input
                                        placeholder="Search by email"
                                        prefix={<SearchOutlined />}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        allowClear
                                    />
                                </Col>
                                <Col span={8}>
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Filter by status"
                                        onChange={setSelectedStatus}
                                        value={selectedStatus}
                                    >
                                        <Option value="all">All Status</Option>
                                        <Option value="pending">Pending</Option>
                                        <Option value="accepted">Accepted</Option>
                                        <Option value="expired">Expired</Option>
                                    </Select>
                                </Col>
                                <Col span={8}>
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Filter by date"
                                        onChange={setSelectedDate}
                                        value={selectedDate}
                                    >
                                        <Option value="all">All Time</Option>
                                        <Option value="today">Today</Option>
                                        <Option value="week">This Week</Option>
                                        <Option value="month">This Month</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={invitations}
                            loading={loading}
                            rowKey="id"
                        />
                    </Card>

                    <Modal
                        title="Send Invitation"
                        visible={isAddModalVisible}
                        onCancel={() => setIsAddModalVisible(false)}
                        footer={null}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleCreateInvitation}
                        >
                            <Form.Item
                                name="email"
                                label="Email Address"
                                rules={[
                                    { required: true, message: 'Please enter email address' },
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input placeholder="Enter email address" />
                            </Form.Item>

                            <Form.Item
                                name="expiresAt"
                                label="Expiration Date"
                                rules={[{ required: true, message: 'Please select expiration date' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => current && current.valueOf() < Date.now()}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        Send Invitation
                                    </Button>
                                    <Button onClick={() => setIsAddModalVisible(false)}>
                                        Cancel
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </Layout>
        </Layout>
    );
}