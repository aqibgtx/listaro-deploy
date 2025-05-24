import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

interface AdminUser {
  id: string;
  user_id: string;
  temp_key: string;
  name: string | null;
}

interface EditingUser extends AdminUser {
  isNew?: boolean;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (user: AdminUser) => {
    setEditingUser(user);
  };

  const cancelEditing = () => {
    setEditingUser(null);
  };

  const startAddingUser = () => {
    setEditingUser({
      id: '',
      user_id: '',
      temp_key: '',
      name: '',
      isNew: true
    });
  };

  const saveUser = async () => {
    if (!editingUser) return;

    try {
      if (editingUser.isNew) {
        const { error } = await supabase
          .from('admin_users')
          .insert({
            user_id: editingUser.user_id,
            temp_key: editingUser.temp_key,
            name: editingUser.name
          });

        if (error) throw error;
        toast.success('User added successfully');
      } else {
        const { error } = await supabase
          .from('admin_users')
          .update({
            user_id: editingUser.user_id,
            temp_key: editingUser.temp_key,
            name: editingUser.name
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        toast.success('User updated successfully');
      }

      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Admin Dashboard – Manage Users
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage user access and temporary keys
            </p>
          </div>

          <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="px-6 py-5 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Registered Users</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Temp Key</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className={isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{user.user_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{user.temp_key}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{user.name || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            onClick={() => startEditing(user)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Pencil className="h-5 w-5 inline" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t dark:border-gray-700">
              <button
                onClick={startAddingUser}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Plus className="h-4 w-4" /> Add New User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Add User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-xl`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingUser.isNew ? 'Add New User' : 'Edit User'}
              </h3>
              <button
                onClick={cancelEditing}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  value={editingUser.user_id}
                  onChange={e => setEditingUser({ ...editingUser, user_id: e.target.value })}
                  className={`block w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Temporary Key
                </label>
                <input
                  type="text"
                  value={editingUser.temp_key}
                  onChange={e => setEditingUser({ ...editingUser, temp_key: e.target.value })}
                  className={`block w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={editingUser.name || ''}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  className={`block w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={cancelEditing}
                className={`flex-1 px-4 py-2 border rounded-xl text-sm font-medium ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={saveUser}
                className="flex-1 px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}