import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { Home, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/', { replace: true });
  };

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center text-white">
      <div className="flex-2"></div>
      <div className="flex items-center space-x-2">
        <Link to="/home" className="flex items-center space-x-2 text-white hover:text-gray-300">
          <Home size={23} />
          <span className='text-xl'>Home</span>
        </Link>
        <Link to="/profile" className="flex items-center space-x-2 text-white hover:text-gray-300">
          <User size={23} className='ml-5' />
          <span className='text-xl'>Profile</span>
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center space-x-1 bg-red-600 px-3 py-2 rounded-lg text-white hover:bg-red-500"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default Navbar;
