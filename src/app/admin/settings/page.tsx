'use client';

import { useState } from 'react';
import { Layout, Form, Input, Select, Card, Row, Col, Space, Button, Switch, InputNumber, Menu, message, Tabs } from 'antd';
import { DashboardOutlined, TeamOutlined, HistoryOutlined, WalletOutlined, SettingOutlined, RobotOutlined, NotificationOutlined, SecurityScanOutlined, DollarOutlined, PictureOutlined } from '@ant-design/icons';
import { api } from '@/app/services/api';

const { Content, Sider } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

export default function Settings() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            //await api.updateSettings(values);
            message.success('Settings updated successfully');
        } catch (error) {
            message.error('Failed to update settings');
            console.error('Error updating settings:', error);
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
                    defaultSelectedKeys={['settings']}
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
                    <Card bordered={false}>
                        <Tabs defaultActiveKey="1">
                            <TabPane
                                tab={
                                    <span>
                                        <RobotOutlined />
                                        Bot Configuration
                                    </span>
                                }
                                key="1"
                            >
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                    initialValues={{
                                        botToken: '',
                                        botUsername: '',
                                        commandPrefix: '/',
                                        maxDailyClicks: 100,
                                        clickReward: 0.001,
                                    }}
                                >
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="botToken"
                                                label="Bot Token"
                                                rules={[{ required: true, message: 'Please enter bot token' }]}
                                            >
                                                <Input.Password placeholder="Enter bot token" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="botUsername"
                                                label="Bot Username"
                                                rules={[{ required: true, message: 'Please enter bot username' }]}
                                            >
                                                <Input prefix="@" placeholder="Enter bot username" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={8}>
                                            <Form.Item
                                                name="commandPrefix"
                                                label="Command Prefix"
                                            >
                                                <Input placeholder="Enter command prefix" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="maxDailyClicks"
                                                label="Max Daily Clicks"
                                                rules={[{ required: true, message: 'Please enter max daily clicks' }]}
                                            >
                                                <InputNumber min={1} max={1000} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="clickReward"
                                                label="Click Reward (USD)"
                                                rules={[{ required: true, message: 'Please enter click reward' }]}
                                            >
                                                <InputNumber
                                                    min={0.001}
                                                    max={1}
                                                    step={0.001}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </TabPane>

                            <TabPane
                                tab={
                                    <span>
                                        <PictureOutlined />
                                        Advertisement Settings
                                    </span>
                                }
                                key="2"
                            >
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                    initialValues={{
                                        adApprovalRequired: true,
                                        minAdDuration: 24,
                                        maxAdDuration: 168,
                                        minAdBudget: 10,
                                    }}
                                >
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="adApprovalRequired"
                                                label="Ad Approval Required"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={8}>
                                            <Form.Item
                                                name="minAdDuration"
                                                label="Minimum Ad Duration (hours)"
                                                rules={[{ required: true, message: 'Please enter minimum ad duration' }]}
                                            >
                                                <InputNumber min={1} max={168} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="maxAdDuration"
                                                label="Maximum Ad Duration (hours)"
                                                rules={[{ required: true, message: 'Please enter maximum ad duration' }]}
                                            >
                                                <InputNumber min={24} max={720} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="minAdBudget"
                                                label="Minimum Ad Budget (USD)"
                                                rules={[{ required: true, message: 'Please enter minimum ad budget' }]}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={1000}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </TabPane>

                            <TabPane
                                tab={
                                    <span>
                                        <DollarOutlined />
                                        Payment Settings
                                    </span>
                                }
                                key="3"
                            >
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                    initialValues={{
                                        minWithdrawal: 10,
                                        maxWithdrawal: 1000,
                                        withdrawalFee: 1,
                                        paymentMethods: ['USDT'],
                                    }}
                                >
                                    <Row gutter={24}>
                                        <Col span={8}>
                                            <Form.Item
                                                name="minWithdrawal"
                                                label="Minimum Withdrawal (USD)"
                                                rules={[{ required: true, message: 'Please enter minimum withdrawal amount' }]}
                                            >
                                                <InputNumber min={1} max={100} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="maxWithdrawal"
                                                label="Maximum Withdrawal (USD)"
                                                rules={[{ required: true, message: 'Please enter maximum withdrawal amount' }]}
                                            >
                                                <InputNumber min={10} max={10000} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="withdrawalFee"
                                                label="Withdrawal Fee (%)"
                                                rules={[{ required: true, message: 'Please enter withdrawal fee' }]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    max={10}
                                                    step={0.1}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="paymentMethods"
                                                label="Payment Methods"
                                                rules={[{ required: true, message: 'Please select at least one payment method' }]}
                                            >
                                                <Select mode="multiple" placeholder="Select payment methods">
                                                    <Option value="USDT">USDT</Option>
                                                    <Option value="BTC">Bitcoin</Option>
                                                    <Option value="ETH">Ethereum</Option>
                                                    <Option value="BNB">Binance Coin</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </TabPane>

                            <TabPane
                                tab={
                                    <span>
                                        <SecurityScanOutlined />
                                        Security Settings
                                    </span>
                                }
                                key="4"
                            >
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                    initialValues={{
                                        twoFactorRequired: false,
                                        maxLoginAttempts: 5,
                                        passwordExpiration: 90,
                                        ipWhitelist: [],
                                    }}
                                >
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="twoFactorRequired"
                                                label="Require 2FA for Admin Access"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="maxLoginAttempts"
                                                label="Maximum Login Attempts"
                                                rules={[{ required: true, message: 'Please enter maximum login attempts' }]}
                                            >
                                                <InputNumber min={1} max={10} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="passwordExpiration"
                                                label="Password Expiration (days)"
                                                rules={[{ required: true, message: 'Please enter password expiration days' }]}
                                            >
                                                <InputNumber min={30} max={365} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="ipWhitelist"
                                                label="IP Whitelist"
                                            >
                                                <Select
                                                    mode="tags"
                                                    style={{ width: '100%' }}
                                                    placeholder="Enter IP addresses"
                                                    tokenSeparators={[',']}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={loading}>
                                            Save Changes
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>

                            <TabPane
                                tab={
                                    <span>
                                        <NotificationOutlined />
                                        Notification Settings
                                    </span>
                                }
                                key="5"
                            >
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                    initialValues={{
                                        emailNotifications: true,
                                        telegramNotifications: true,
                                        withdrawalNotifications: true,
                                        loginAlerts: true,
                                    }}
                                >
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="emailNotifications"
                                                label="Email Notifications"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="telegramNotifications"
                                                label="Telegram Notifications"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="withdrawalNotifications"
                                                label="Withdrawal Notifications"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="loginAlerts"
                                                label="Login Alert Notifications"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={loading}>
                                            Save Changes
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
            </Layout>
        </Layout>
    );
}
                                     