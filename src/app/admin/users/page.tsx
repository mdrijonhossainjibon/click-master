'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons';

interface User {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'johndoe',
        email: 'john@example.com',
        status: 'active',
        joinedDate: '2024-03-28'
      },
      {
        id: '2',
        username: 'janedoe',
        email: 'jane@example.com',
        status: 'active',
        joinedDate: '2024-03-27'
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center">
            <UserOutlined className="mr-3 text-blue-400" />
            Users Management
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setLoading(true)}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl transition-all duration-300 border border-gray-700 hover:bg-gray-700
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
            >
              <ReloadOutlined className={`${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => {/* Handle add user */}}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl transition-all duration-300 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <PlusOutlined />
              Add User
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
            />
            <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                            <UserOutlined className="text-gray-400" />
                          </div>
                          <span className="ml-3 font-medium text-gray-100">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${user.status === 'active' 
                            ? 'bg-green-900/20 text-green-400' 
                            : 'bg-gray-900/20 text-gray-400'
                          }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.joinedDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {/* Handle edit */}}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                          >
                            <EditOutlined />
                          </button>
                          <button
                            onClick={() => {/* Handle delete */}}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
