import React from 'react';
import Navbar from '../../components/User/Navbar';
import EditProfile from '../../components/User/EditProfile';

const Profile: React.FC = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900">
      <Navbar />
      <EditProfile />
    </div>
  );
};

export default Profile;