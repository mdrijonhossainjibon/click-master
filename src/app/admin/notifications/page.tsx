'use client';

import { useState } from 'react';
import { Layout, Form, Card, Row, Col, Switch, Menu, message, Tabs, Divider } from 'antd';
import { DashboardOutlined, TeamOutlined, HistoryOutlined, WalletOutlined, SettingOutlined, BellOutlined, MailOutlined, RobotOutlined } from '@ant-design/icons';
import { api } from '@/app/services/api';

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

export default function NotificationSettings() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            //await api.updateNotificationSettings(values);
            message.success('Notification settings updated successfully');
        } catch (error) {
            message.error('Failed to update notification settings');
            console.error('Error updating notification settings:', error);
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
                        <Tabs defaultActiveKey="1">
                            <TabPane
                                tab={
                                    <span>
                                        <MailOutlined />
                                        Email Notifications
                                    </span>
                                }
                                key="1"
                            >
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                    initialValues={{
                                        emailNewLogin: true,
                                        emailWithdrawal: true,
                                        emailDailyReport: false,
                                        emailNewAd: true,
                                    }}
                                >
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="emailNewLogin"
                                                label="New Login Alerts"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                            <Form.Item
                                                name="emailWithdrawal"
                                                label="Withdrawal Notifications"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="emailDailyReport"
                                                label="Daily Activity Report"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                            <Form.Item
                                                name="emailNewAd"
                                                label="New Advertisement Alerts"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </TabPane>

                            <TabPane
                                tab={
                                    <span>
                                        <RobotOutlined />
                                        Telegram Notifications
                                    </span>
                                }
                                key="2"
                            >
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                    initialValues={{
                                        telegramNewLogin: true,
                                        telegramWithdrawal: true,
                                        telegramDailyReport: true,
                                        telegramNewAd: false,
                                    }}
                                >
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="telegramNewLogin"
                                                label="New Login Alerts"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                            <Form.Item
                                                name="telegramWithdrawal"
                                                label="Withdrawal Notifications"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="telegramDailyReport"
                                                label="Daily Activity Report"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                            <Form.Item
                                                name="telegramNewAd"
                                                label="New Advertisement Alerts"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
            </Layout>
        </Layout>
    );
}