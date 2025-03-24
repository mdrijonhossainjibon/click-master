'use client';

import { useEffect, useState } from 'react';
import { Layout, Form, Input, Select, Card, Space, Button, message, Menu, Row, Col, Statistic, Tabs, List, Avatar, Divider } from 'antd';
import { UserOutlined, MailOutlined, DashboardOutlined, TeamOutlined, HistoryOutlined, WalletOutlined, SettingOutlined, DollarOutlined } from '@ant-design/icons';
import { api, User } from '@/app/services/api';
import { useParams, useRouter } from 'next/navigation';

const { Content, Sider } = Layout;

export default function EditUser() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await api.getUser(id as string);
            setUser(response);
            form.setFieldsValue({
                fullName: response.fullName,
                email: response.email,
                telegramId: response.telegramId.replace(/^@/, ''),
                role: response.role,
                status: response.status
            });
        } catch (error) {
            message.error('Failed to fetch user details');
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            await api.updateUser(id as string, values);
            message.success('User updated successfully');
            router.push('/admin/users');
        } catch (error) {
            message.error('Failed to update user');
            console.error('Error updating user:', error);
        } finally {
            setLoading(false);
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
                    defaultSelectedKeys={['users']}
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
                                    key: 'payments',
                                    label: 'Payments',
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
            <Content className="p-6">
                <Card bordered={false} className="mb-4">
                    <Row gutter={24}>
                        <Col span={8}>
                            <Statistic
                                title="Balance"
                                value={user?.balance || 0}
                                prefix={<DollarOutlined />}
                                precision={2}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="Total Earnings"
                                value={user?.totalEarnings || 0}
                                prefix={<DollarOutlined />}
                                precision={2}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="Last Updated"
                                value={user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                            />
                        </Col>
                    </Row>
                </Card>

                <Card
                    title="Edit User"
                    bordered={false}
                    className="max-w-2xl mx-auto"
                >
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Basic Information" key="1">
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                requiredMark={false}
                                className="user-form"
                            >
                        <Form.Item
                            name="fullName"
                            label="Full Name"
                            rules={[
                                { required: true, message: 'Please enter full name' },
                                { min: 3, message: 'Full name must be at least 3 characters' }
                            ]}
                        >
                            <Input 
                                prefix={<UserOutlined />} 
                                placeholder="Enter full name"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input 
                                prefix={<MailOutlined />} 
                                placeholder="Enter email"
                            />
                        </Form.Item>

                        <Form.Item
                            name="telegramId"
                            label="Telegram ID"
                            rules={[
                                { required: true, message: 'Please enter Telegram ID' },
                                { pattern: /^@?[\w\d_]{5,32}$/, message: 'Please enter a valid Telegram ID' }
                            ]}
                        >
                            <Input 
                                prefix="@"
                                placeholder="username"
                            />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label="Role"
                            rules={[{ required: true, message: 'Please select role' }]}
                        >
                            <Select placeholder="Select role">
                                <Select.Option value="admin">Admin</Select.Option>
                                <Select.Option value="moderator">Moderator</Select.Option>
                                <Select.Option value="user">User</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select status' }]}
                        >
                            <Select placeholder="Select status">
                                <Select.Option value="active">Active</Select.Option>
                                <Select.Option value="inactive">Inactive</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item className="mb-0">
                            <Space className="w-full justify-end">
                                <Button onClick={() => router.push('/admin/users')}>
                                    Cancel
                                </Button>
                                <Button 
                                    type="primary" 
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    Update User
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Financial Information" key="2">
                            <Form
                                layout="vertical"
                                onFinish={async (values) => {
                                    try {
                                        setLoading(true);
                                        await api.updateUser(id as string, {
                                            balance: parseFloat(values.balance)
                                        });
                                        message.success('Balance updated successfully');
                                        fetchUser();
                                    } catch (error) {
                                        message.error('Failed to update balance');
                                        console.error('Error updating balance:', error);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            >
                                <Form.Item
                                    name="balance"
                                    label="Adjust Balance"
                                    rules={[
                                        { required: true, message: 'Please enter balance amount' },
                                        { type: 'number', message: 'Please enter a valid number', transform: (value) => parseFloat(value) }
                                    ]}
                                    initialValue={user?.balance?.toString()}
                                >
                                    <Input
                                        prefix={<DollarOutlined />}
                                        type="number"
                                        step="0.01"
                                        placeholder="Enter new balance"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        Update Balance
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Divider />
                            <h3>Transaction History</h3>
                            <List
                                itemLayout="horizontal"
                                dataSource={[]} // TODO: Implement transaction history
                                renderItem={(item: any) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<DollarOutlined />} />}
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Activity History" key="3">
                            <List
                                itemLayout="horizontal"
                                dataSource={[]} // TODO: Implement activity history
                                renderItem={(item: any) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<UserOutlined />} />}
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
            </Content>
        </Layout>
    );
}