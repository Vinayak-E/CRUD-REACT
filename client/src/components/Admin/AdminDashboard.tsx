import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import Swal from 'sweetalert2';
import { LogOut } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  password?: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/api/admin/getUsers');
      setUsers(response.data.users);
    } catch (error) {
      setError('Error fetching users. Please try again later.');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
          });

          if (result.isConfirmed) {
            await api.delete(`/api/admin/deleteUser/${userId}`);
            
            Swal.fire(
              'Deleted!',
              'The user has been deleted.',
              'success'
            );
      setUsers(users.filter(user => user._id !== userId));
            }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      if (error.response) {
        Swal.fire(
          'Error!',
          error.response.data.message || 'Failed to delete user. Please try again.',
          'error'
        );
      } else {
        Swal.fire(
          'Error!',
          'An unexpected error occurred. Please try again later.',
          'error'
        );
      }
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddModalOpen(true);
  };

  const handleUserSubmit = (newUser: User) => {
    if (selectedUser) {
      setUsers(users.map(user => (user._id === newUser._id ? newUser : user)));
    } else {
      setUsers([...users, newUser]);
    }
    setIsAddModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900">
   
      <div className="mb-8 bg-gray-800 rounded-lg p-6 shadow-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">User Management System</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddUser}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg
                     transition-colors duration-200 flex items-center gap-2 shadow-md"
          >
            <span className="text-xl">+</span>
            Add User
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg
                     transition-colors duration-200 flex items-center gap-2 shadow-md"
          >
             <LogOut className="w-5 h-5" />
             <span>Logout</span>
            
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-4 text-white font-semibold">Name</th>
                <th className="px-6 py-4 text-white font-semibold">Email</th>
                <th className="px-6 py-4 text-white font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map(user => (
                <tr 
                  key={user._id}
                  className="hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4 text-white">{user.email}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded
                                 transition-colors duration-200 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded
                                 transition-colors duration-200 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleUserSubmit}
        />
      )}

      {isEditModalOpen && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUserSubmit}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default AdminDashboard;