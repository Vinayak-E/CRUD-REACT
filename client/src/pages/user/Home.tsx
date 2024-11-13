import React from 'react';
import Dashboard from '../../components/User/Dashbord';
import Navbar from '../../components/User/Navbar';

const Home: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 ">
      <Navbar />
      <Dashboard />
    </div>
  );
};

export default Home;
