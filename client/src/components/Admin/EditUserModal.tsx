import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { validateEmail,validateName } from '../../utils/validation';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  user: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSubmit, user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [backendError, setBackendError] = useState(''); 

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    } else {
      setName('');
      setEmail('');
      setIsAdmin(false);
    }
  }, [user]);

  const validateForm = (): boolean => {
    const nameError = validateName(name) ? '' : 'Invalid name. Name must be at least 3 characters';
    const emailError = validateEmail(email) ? '' : 'Please enter a valid email address.';


    setErrors({ name: nameError, email: emailError});
    return !(nameError || emailError );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;


    try {
      const userData: User = { _id: user!._id, name, email, isAdmin };
      await api.put(`/api/admin/updateUser/${user!._id}`, userData);
      onSubmit(userData);
      onClose();
    } catch (error: any) {
      console.error('Error submitting user data:', error);
      setBackendError(error.response?.data?.message || 'Failed to submit user data. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-700 rounded-lg  text-white shadow-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Edit User</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-medium mb-1" htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {setName(e.target.value);
                    setErrors(prev => ({ ...prev, name: validateName(name) ? '' : 'Invalid name' }))}}
                
                className="w-full p-2 rounded-lg mt-1 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1" htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors(prev => ({ ...prev, email: validateEmail(e.target.value) ? '' : 'Please enter a valid email' }))}}
                className="w-full p-2 rounded-lg mt-1 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
               {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            {backendError && <p className="text-red-500 mb-4">{backendError}</p>}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;