'use client';

import { useState } from 'react';
import { Layout, Form, Input, Select, Card, Row, Col, Space, Button, Switch, InputNumber, Menu, message, Table, Modal } from 'antd';
import { DashboardOutlined, TeamOutlined, HistoryOutlined, WalletOutlined, SettingOutlined, DollarOutlined, PlusOutlined } from '@ant-design/icons';
import { api } from '@/app/services/api';

const { Content, Sider } = Layout;
const { Option } = Select;

interface PaymentMethod {
    id: string;
    name: string;
    currency: string;
    network: string;
    fee: number;
    minAmount: number;
    maxAmount: number;
    isActive: boolean;
}

export default function PaymentMethods() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency',
        },
        {
            title: 'Network',
            dataIndex: 'network',
            key: 'network',
        },
        {
            title: 'Fee',
            dataIndex: 'fee',
            key: 'fee',
            render: (fee: number) => `${fee}%`,
        },
        {
            title: 'Min Amount',
            dataIndex: 'minAmount',
            key: 'minAmount',
            render: (amount: number) => `$${amount}`,
        },
        {
            title: 'Max Amount',
            dataIndex: 'maxAmount',
            key: 'maxAmount',
            render: (amount: number) => `$${amount}`,
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Switch checked={isActive} onChange={(checked) => handleStatusChange(checked)} />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: PaymentMethod) => (
                <Space size="middle">
                    <Button type="primary" size="small" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button danger size="small" onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            // await api.createPaymentMethod(values);
            message.success('Payment method added successfully');
            setIsAddModalVisible(false);
            form.resetFields();
            // fetchPaymentMethods();
        } catch (error) {
            message.error('Failed to add payment method');
            console.error('Error adding payment method:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (checked: boolean) => {
        // Implement status change logic
    };

    const handleEdit = (record: PaymentMethod) => {
        // Implement edit logic
    };

    const handleDelete = async (id: string) => {
        // Implement delete logic
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light">
                <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}>
                    {!collapsed ? 'ClickMaster' : 'CM'}
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['payment-methods']}
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
                                    key: 'payment-methods',
                                    label: 'Payment Methods',
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
                    <Card
                        title="Payment Methods"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsAddModalVisible(true)}
                            >
                                Add Payment Method
                            </Button>
                        }
                        bordered={false}
                    >
                        <Table
                            columns={columns}
                            dataSource={paymentMethods}
                            loading={loading}
                            rowKey="id"
                        />
                    </Card>

                    <Modal
                        title="Add Payment Method"
                        visible={isAddModalVisible}
                        onCancel={() => setIsAddModalVisible(false)}
                        footer={null}
                        className="payment-method-modal"
                        width="100%"
                        style={{ maxWidth: '100vw', margin: 0, padding: 0, top: 0 }}
                        modalRender={modal => (
                            <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeIn">
                                <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl border border-gray-700/50 shadow-2xl transform transition-all duration-300 scale-100 animate-modalSlideIn">
                                    {modal}
                                </div>
                            </div>
                        )}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            className="space-y-6"
                        >
                            <Form.Item
                                name="name"
                                label="Payment Method Name"
                                rules={[{ required: true, message: 'Please enter payment method name' }]}
                            >
                                <Input placeholder="Enter payment method name" />
                            </Form.Item>

                            <Form.Item
                                name="currency"
                                label="Currency"
                                rules={[{ required: true, message: 'Please select currency' }]}
                            >
                                <Select placeholder="Select currency">
                                    <Option value="USD">USD</Option>
                                    <Option value="EUR">EUR</Option>
                                    <Option value="GBP">GBP</Option>
                                    <Option value="USDT">USDT</Option>
                                    <Option value="BTC">BTC</Option>
                                    <Option value="ETH">ETH</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="network"
                                label="Network"
                                rules={[{ required: true, message: 'Please select network' }]}
                            >
                                <Select placeholder="Select network">
                                    <Option value="ERC20">ERC20</Option>
                                    <Option value="TRC20">TRC20</Option>
                                    <Option value="BEP20">BEP20</Option>
                                    <Option value="Bitcoin">Bitcoin</Option>
                                    <Option value="Ethereum">Ethereum</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="fee"
                                label="Transaction Fee (%)"
                                rules={[{ required: true, message: 'Please enter transaction fee' }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    step={0.01}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="minAmount"
                                        label="Minimum Amount"
                                        rules={[{ required: true, message: 'Please enter minimum amount' }]}
                                    >
                                        <InputNumber
                                            min={0}
                                            step={0.01}
                                            style={{ width: '100%' }}
                                            prefix="$"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="maxAmount"
                                        label="Maximum Amount"
                                        rules={[{ required: true, message: 'Please enter maximum amount' }]}
                                    >
                                        <InputNumber
                                            min={0}
                                            step={0.01}
                                            style={{ width: '100%' }}
                                            prefix="$"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="isActive"
                                valuePropName="checked"
                                initialValue={true}
                            >
                                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                            </Form.Item>

                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        Add Payment Method
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