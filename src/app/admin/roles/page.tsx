'use client';

import { useState } from 'react';
import { Layout, Table, Button, Input, Card, Row, Col, Space, Tag, Menu, Modal, Form, Checkbox, message } from 'antd';
import { DashboardOutlined, TeamOutlined, HistoryOutlined, WalletOutlined, SettingOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { api } from '@/app/services/api';

const { Content, Sider } = Layout;

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
}

interface Permission {
    id: string; 
    name: string;
    description: string;
    module: string;
}

export default function RolesPage() {
    const [searchText, setSearchText] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [collapsed, setCollapsed] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Role Name',
            dataIndex: 'name',
            key: 'name',
            className: 'text-sm'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            className: 'text-sm'
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            className: 'text-sm',
            render: (permissions: string[]) => (
                <Space size={[0, 4]} wrap>
                    {permissions.map((permission) => (
                        <Tag color="blue" key={permission}>
                            {permission}
                        </Tag>
                    ))}
                </Space>
            )
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            className: 'text-sm',
            render: (date: string) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Actions',
            key: 'actions',
            className: 'text-sm',
            render: (_: any, record: Role) => (
                <Space size="middle">
                    <Button type="primary" size="small" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button danger size="small" onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        form.setFieldsValue({
            name: role.name,
            description: role.description,
            permissions: role.permissions
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (roleId: string) => {
        try {
           // await api.deleteRole(roleId);
            message.success('Role deleted successfully');
            fetchRoles();
        } catch (error) {
            console.error('Error deleting role:', error);
            message.error('Failed to delete role');
        }
    };

    const fetchRoles = async () => {
        try {
            setLoading(true);
            //const response = await api.getRoles();
            //setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
            message.error('Failed to fetch roles');
        } finally {
            setLoading(false);
        }
    };

    const fetchPermissions = async () => {
        try {
           /*  const response = await api.getPermissions();
            setPermissions(response.data); */
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingRole) {
                //await api.updateRole(editingRole.id, values);
                message.success('Role updated successfully');
            } else {
                //await api.createRole(values);
                message.success('Role created successfully');
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchRoles();
        } catch (error) {
            console.error('Error saving role:', error);
            message.error('Failed to save role');
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
                    defaultSelectedKeys={['roles']}
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
                    <Card
                        title="Roles & Permissions"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setEditingRole(null);
                                    form.resetFields();
                                    setIsModalVisible(true);
                                }}
                            >
                                Create Role
                            </Button>
                        }
                        bordered={false}
                    >
                        <div className="mb-4">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Input
                                        placeholder="Search roles"
                                        prefix={<SearchOutlined />}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        allowClear
                                    />
                                </Col>
                            </Row>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={roles.filter(role =>
                                role.name.toLowerCase().includes(searchText.toLowerCase()) ||
                                role.description.toLowerCase().includes(searchText.toLowerCase())
                            )}
                            loading={loading}
                            rowKey="id"
                        />
                    </Card>

                    <Modal
                        title={editingRole ? 'Edit Role' : 'Create Role'}
                        visible={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={null}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <Form.Item
                                name="name"
                                label="Role Name"
                                rules={[{ required: true, message: 'Please enter role name' }]}
                            >
                                <Input placeholder="Enter role name" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Please enter role description' }]}
                            >
                                <Input.TextArea placeholder="Enter role description" />
                            </Form.Item>

                            <Form.Item
                                name="permissions"
                                label="Permissions"
                                rules={[{ required: true, message: 'Please select at least one permission' }]}
                            >
                                <Checkbox.Group style={{ width: '100%' }}>
                                    <Row>
                                        {permissions.map(permission => (
                                            <Col span={24} key={permission.id}>
                                                <Checkbox value={permission.id}>
                                                    {permission.name} - {permission.description}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>

                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        {editingRole ? 'Update' : 'Create'}
                                    </Button>
                                    <Button onClick={() => setIsModalVisible(false)}>
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