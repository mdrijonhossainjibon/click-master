'use client';

import { useState } from 'react';
import { Layout, Card, Form, Input, Select, Button, Space, Statistic, Menu, Row, Col } from 'antd';
import { DashboardOutlined, TeamOutlined, HistoryOutlined, WalletOutlined, SettingOutlined, DollarOutlined } from '@ant-design/icons';
import NetworkSelector from '../components/NetworkSelector';

const { Content, Sider } = Layout;

export default function WithdrawPage() {
    const [network, setNetwork] = useState('bitget');
    const [amount, setAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [amountError, setAmountError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [balance, setBalance] = useState(0);
    const [collapsed, setCollapsed] = useState(false);

    // TODO: Fetch user balance from API
    const fetchBalance = async () => {
        try {
            const response = await fetch('/api/users/balance');
            const data = await response.json();
            if (response.ok) {
                setBalance(data.balance);
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const validateWithdrawAmount = (value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            setAmountError('Please enter a valid number');
            return false;
        }
        if (numValue < 0.002) {
            setAmountError('Minimum withdrawal amount is $0.002');
            return false;
        }
        if (numValue > 10.000) {
            setAmountError('Maximum withdrawal limit is $10.000');
            return false;
        }
        if (numValue > balance) {
            setAmountError('Amount exceeds available balance');
            return false;
        }
        setAmountError('');
        return true;
    };

    const setMaxAmount = () => {
        if (balance > 10.000) {
            setAmount('10.000');
        } else {
            setAmount(balance.toFixed(3));
        }
        setAmountError('');
    };

    const submitWithdrawal = async () => {
        if (!validateWithdrawAmount(amount)) return;
        if (!walletAddress.trim()) {
            setAmountError('Please enter a wallet address');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    network,
                    amount,
                    walletAddress,
                    userId: '123' // Replace with actual user ID from authentication
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process withdrawal');
            }

            setAmount('');
            setWalletAddress('');
            setAmountError('');
        } catch (error) {
            console.error('Withdrawal error:', error);
        } finally {
            setIsSubmitting(false);
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
                    defaultSelectedKeys={['withdraw']}
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
                                    key: 'withdraw',
                                    label: 'Withdraw Funds',
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
                                title="Available Balance"
                                value={balance}
                                prefix={<DollarOutlined />}
                                precision={3}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="Minimum Withdrawal"
                                value={0.002}
                                prefix={<DollarOutlined />}
                                precision={3}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="Maximum Withdrawal"
                                value={10.000}
                                prefix={<DollarOutlined />}
                                precision={3}
                            />
                        </Col>
                    </Row>
                </Card>

                <Card title="Withdraw Funds" bordered={false}>
                    <Form layout="vertical" onFinish={submitWithdrawal}>
                        <Form.Item label="Select Network" name="network" initialValue={network}>
                            <NetworkSelector
                                value={network}
                                onChange={setNetwork}
                                disabled={false}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Withdrawal Amount"
                            name="amount"
                            validateStatus={amountError ? 'error' : ''}
                            help={amountError}
                            rules={[{ required: true, message: 'Please enter withdrawal amount' }]}
                        >
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    validateWithdrawAmount(e.target.value);
                                }}
                                placeholder="0.000"
                                step="0.001"
                                min="0.002"
                                disabled={balance < 0.002}
                                prefix="$"
                                suffix={
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={setMaxAmount}
                                        disabled={balance < 0.002}
                                    >
                                        MAX
                                    </Button>
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            label="Wallet Address"
                            name="walletAddress"
                            rules={[{ required: true, message: 'Please enter wallet address' }]}
                        >
                            <Input
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                placeholder="Enter your wallet address"
                                disabled={balance < 0.002}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting}
                                disabled={balance < 0.002}
                                block
                            >
                                {balance < 0.002 ? 'Insufficient Balance' : isSubmitting ? 'Processing...' : 'Request Withdrawal'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                <Card title="Withdrawal Information" bordered={false} className="mt-4">
                    <ul className="space-y-2">
                        <li>• Minimum withdrawal amount: $0.002</li>
                        <li>• Maximum withdrawal limit: $10.000</li>
                        <li>• Processing time: 24-48 hours</li>
                        <li>• Supported networks: Bitget USDT, Binance USDT (BEP20)</li>
                        <li>• Make sure to verify your wallet address before submitting</li>
                    </ul>
                </Card>
            </Content>
        </Layout>
    );
}
