'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Menu, Divider, Table, Input, Modal, Form, message, Select } from 'antd';
import {
  RedoOutlined,
  DashboardOutlined,
  UserOutlined,
  WalletOutlined,
  CreditCardOutlined,
  SettingOutlined,
  BellOutlined,
  TeamOutlined,
  HistoryOutlined,
  LinkOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

interface Link {
  _id: string;
  title: string;
  url: string;
  icon: string;
  gradient: {
    from: string;
    to: string;
  };
  clicks: number;
  isActive: boolean;
  position: number;
  category: string;
  lastClicked?: Date;
}

export default function LinksAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Users'
    },
    {
      key: '/admin/withdrawals',
      icon: <WalletOutlined />,
      label: 'Withdrawals'
    },
    {
      key: '/admin/links',
      icon: <LinkOutlined />,
      label: 'Links'
    },
    {
      key: '/admin/payment-methods',
      icon: <CreditCardOutlined />,
      label: 'Payment Methods'
    },
    {
      key: '/admin/notifications',
      icon: <BellOutlined />,
      label: 'Notifications'
    },
    {
      key: '/admin/roles',
      icon: <TeamOutlined />,
      label: 'Roles'
    },
    {
      key: '/admin/history',
      icon: <HistoryOutlined />,
      label: 'History'
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings'
    }
  ];

  const columns = [
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      sorter: (a: Link, b: Link) => a.position - b.position,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
          {text}
        </a>
      ),
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (text: string) => <span className="text-xl">{text}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Clicks',
      dataIndex: 'clicks',
      key: 'clicks',
      sorter: (a: Link, b: Link) => a.clicks - b.clicks,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <span className={`px-2 py-1 rounded-full text-sm ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Link) => (
        <div className="space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-yellow-500 border-yellow-500 hover:text-yellow-600 hover:border-yellow-600"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            className="text-red-500 border-red-500 hover:text-red-600 hover:border-red-600"
          />
        </div>
      ),
    },
  ];

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/links');
      const data = await response.json();
      if (data.success) {
        setLinks(data.links);
      }
    } catch (error) {
      message.error('Failed to fetch links');
    }
    setLoading(false);
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    form.setFieldsValue(link);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/links/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        message.success('Link deleted successfully');
        handleRefresh();
      }
    } catch (error) {
      message.error('Failed to delete link');
    }
  };

  const handleModalOk = async (values: any) => {
    try {
      const method = editingLink ? 'PUT' : 'POST';
      const url = editingLink ? `/api/admin/links/${editingLink._id}` : '/api/admin/links';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (data.success) {
        message.success(`Link ${editingLink ? 'updated' : 'created'} successfully`);
        setIsModalVisible(false);
        form.resetFields();
        setEditingLink(null);
        handleRefresh();
      } else if (data.validationErrors) {
        // Handle validation errors
        Object.entries(data.validationErrors).forEach(([field, msg]) => {
          message.error(`${field}: ${msg}`);
        });
      }
    } catch (error) {
      message.error('Failed to save link');
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div className="dark:bg-gray-900 bg-amber-50">
      <div className="min-h-screen text-gray-100">
        <aside className="fixed inset-y-0 left-0 bg-gray-800 w-64">
          <Divider />
          <Divider />
          <Divider />
          <Divider />
          <Menu
            mode="inline"
            selectedKeys={['/admin/links']}
            style={{ background: 'transparent', border: 'none' }}
            className="mt-5 text-gray-300"
            onClick={({ key }) => router.push(key)}
            items={menuItems}
            theme="dark"
          />
        </aside>

        <main className="ml-64 p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
          <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
              <LinkOutlined className="mr-3 text-blue-500 text-3xl animate-pulse" />
              Manage Links
            </h1>
            <div className="flex space-x-4">
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingLink(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 border-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Add Link
              </Button>
              <Button
                icon={<RedoOutlined spin={loading} />}
                onClick={handleRefresh}
                loading={loading}
                className="bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 px-6 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-2 border border-gray-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Refresh
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
            <Table
              columns={columns.map(column => ({
                ...column,
                className: 'dark:text-gray-300',
                render: column.render || ((text) => (
                  <span className="transition-colors duration-200 hover:text-blue-500">{text}</span>
                ))
              }))}
              dataSource={links}
              loading={loading}
              rowKey="_id"
              className="dark:text-gray-300"
              pagination={{
                className: 'dark:text-gray-300',
                showTotal: (total) => <span className="dark:text-gray-400">Total {total} items</span>,
                showSizeChanger: true,
                showQuickJumper: true,
                position: ['bottomCenter']
              }}
              rowClassName="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            />
          </div>
        </main>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <LinkOutlined className="text-blue-500" />
            {`${editingLink ? 'Edit' : 'Add'} Link`}
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingLink(null);
        }}
        footer={null}
        className="dark:bg-gray-800"
        maskTransitionName="fade"
        transitionName="zoom"
      >
        <Form 
          form={form} 
          layout="vertical"
          onFinish={handleModalOk}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label={<span className="dark:text-gray-300">Title</span>}
            rules={[{ required: true, message: 'Please input the link title!' }]}
          >
            <Input className="rounded-lg" />
          </Form.Item>
          <Form.Item
            name="url"
            label={<span className="dark:text-gray-300">URL</span>}
            rules={[
              { required: true, message: 'Please input the URL!' },
              { type: 'url', message: 'Please enter a valid URL!' }
            ]}
          >
            <Input className="rounded-lg" />
          </Form.Item>
          <Form.Item
            name="icon"
            label={<span className="dark:text-gray-300">Icon</span>}
            initialValue="🔗"
          >
            <Input className="rounded-lg" />
          </Form.Item>
          <Form.Item
            name="category"
            label={<span className="dark:text-gray-300">Category</span>}
            initialValue="general"
          >
            <Select className="rounded-lg">
              <Select.Option value="general">General</Select.Option>
              <Select.Option value="social">Social</Select.Option>
              <Select.Option value="business">Business</Select.Option>
              <Select.Option value="entertainment">Entertainment</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isActive"
            label={<span className="dark:text-gray-300">Status</span>}
            initialValue={true}
          >
            <Select className="rounded-lg">
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['gradient', 'from']}
            label={<span className="dark:text-gray-300">Gradient From</span>}
            initialValue="rose-600"
          >
            <Input className="rounded-lg" />
          </Form.Item>
          <Form.Item
            name={['gradient', 'to']}
            label={<span className="dark:text-gray-300">Gradient To</span>}
            initialValue="pink-600"
          >
            <Input className="rounded-lg" />
          </Form.Item>
          <Form.Item className="mb-0 flex justify-end">
            <Button 
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingLink(null);
              }} 
              className="mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 border-none rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              {editingLink ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
