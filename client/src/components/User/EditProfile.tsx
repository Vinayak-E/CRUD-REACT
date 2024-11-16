import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { validateEmail, validateName } from '../../utils/validation';

const Profile: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
          setError('User email not found in localStorage');
          return;
        }

        const response = await api.post('/api/auth/getUser', { email: storedEmail });
        const user = response.data.user;

        if (user) {
          setUserId(user._id);
          setUsername(user.name || '');
          setEmail(user.email || '');
          setImage(user.image || '');
        } else {
          setError('User not found');
        }
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.onerror = (err) => console.error('Error reading file', err);
    } else {
      setError('Please select an image file');
    }
  };

  const validateForm = () => {
    if (!validateName(name)) {
      setError('Name should contain only letters and be at least 2 characters long');
      return false;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');
      if (!userId) throw new Error('User ID is missing');

      const response = await api.patch('/api/auth/updateProfile', {
        id: userId,
        name,
        email,
        image,
      });

      setError('Profile updated successfully!');
    } catch (error: any) {
      console.error('Update error:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
      <div className="bg-gray-900 sm:w-[25rem] flex items-center sm:h-[32rem] w-full h-full rounded-md p-5 shadow-2xl relative">
        <form onSubmit={handleSubmit} className="flex flex-col items-center py-[2rem] w-full">
          <div className="flex items-center justify-center mb-4">
            <label htmlFor="image-upload" className="cursor-pointer">
              <img
                src={image ? image.trim() === '' ? 'avatar.png' : image : 'avatar.png'}
                alt="User Avatar"
                className="w-[11rem] h-[11rem] rounded-full object-cover border-2 border-gray-300"
              />
            </label>
            <input type="file" id="image-upload" className="hidden" onChange={handleChangeImage} />
          </div>
          {error && (
            <div
              className={`mb-4 ${
                error === 'Profile updated successfully!' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {error}
            </div>
          )}
          <input
            type="text"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="mb-4 w-full p-2 rounded-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-[rgb(208,197,240)]"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-4 w-full p-2 rounded-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-[rgb(141,134,161)]"
          />
          <button
            type="submit"
            className="w-full h-[3rem] rounded-3xl py-2 px-4 bg-gradient-to-r from-green-800 via-green-700 to-green-900 text-white font-semibold shadow-lg transition transform hover:scale-105 mt-6"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
