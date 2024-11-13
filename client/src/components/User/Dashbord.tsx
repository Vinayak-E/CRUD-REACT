import React, { useCallback, useEffect, useState } from 'react';
import api from '../../api/axios';

interface UserData {
  image: string | null;
  email: string;
  name: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const email = localStorage.getItem('email');
      if (email) {
        const response = await api.post('/api/auth/getUser', { email });
        if (response.data.user) {
          console.log("User data:", response.data.user);
          setUser(response.data.user); 
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <p>No user data found.</p>; 
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            {user.image ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-green-900 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <img 
                  src={user.image} 
                  alt={`${user.name}'s Avatar`}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-gray-700 shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center border-4 border-gray-700 shadow-2xl">
                <span className="text-4xl text-gray-400">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col md:items-start items-center space-y-4 flex-grow">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                {user.name}
              </h1>
              <p className="text-lg text-gray-400 font-medium">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
