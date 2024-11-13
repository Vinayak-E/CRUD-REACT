import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/User/Login';
import Dashboard from './pages/Admin/Dashboard';
import Home from './pages/user/Home';
import Profile from './pages/user/Profile';


const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {

  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/admin"   element={< Dashboard />}   />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
