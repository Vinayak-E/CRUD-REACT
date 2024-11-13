import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { login ,setUser} from '../../redux/slices/authSlice';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { validateForm,validateInput } from '../../utils/validation';

interface FormState {
  name?: string;
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formState, setFormState] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    const error = validateInput(name, value, isRegister);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validateForm(formState, isRegister);
    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    const { email, password, name } = formState;
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      if (isRegister) {
        const response = await api.post("/api/auth/register", { email, password, name });
        setSuccessMessage('Registration successful! Please login.');
        setFormState({ email: '', password: '', name: '' });
        setIsRegister(false);
        console.log('Registered user:', response.data);
      } else {
        const response = await api.post("/api/auth/login", { email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', response.data.user.email);
        dispatch(login({
          image: response.data.image,
          email: response.data.user.email,
          name: response.data.user.name,
          id: response.data.user.id,
        }));
        dispatch(setUser(response.data.user));
        navigate(response.data.user.isAdmin ? '/admin' : '/home');
      }
    } catch (error: any) {
      console.error('Error during form submission:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrors((prev) => ({ ...prev, email: error.response.data.error }));
      } else {
        setErrors((prev) => ({ ...prev, email: 'An unexpected error occurred' }));
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4">
      <div className="w-full max-w-xs sm:max-w-sm bg-gray-900 rounded-lg p-10 shadow-2xl relative">

        {successMessage && !isRegister && (
          <div className="mb-4 p-2 text-green-600 bg rounded">
            {successMessage}
          </div>
        )}
        <h2 className="text-4xl font-semibold mb-6 text-gray-100">{isRegister ? 'REGISTER' : 'LOGIN'}</h2>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formState.name || ''}
                onChange={handleInputChange}
                className={`w-full p-4 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500 ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && <div className="text-red-500 mt-2">{errors.name}</div>}
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formState.email}
              onChange={handleInputChange}
              className={`w-full p-4 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500 ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && <div className="text-red-500 mt-2">{errors.email}</div>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formState.password}
              onChange={handleInputChange}
              className={`w-full p-4 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500 ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            <span onClick={togglePasswordVisibility} className="absolute right-4 top-4 text-gray-400 cursor-pointer">
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
            {errors.password && <div className="text-red-500 mt-2">{errors.password}</div>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-6 rounded-2xl bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 
              text-white font-semibold shadow-lg transition transform hover:scale-105
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
              {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
          </button>
        </form>

        <div className="flex justify-center space-x-4 mt-8">
          <p className="text-gray-400">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              className="text-white cursor-pointer"
              onClick={() => {
                setIsRegister(!isRegister);
                setFormState({ email: '', password: '', name: '' });
                setErrors({});
                setSuccessMessage('');
              }}
            >
              {isRegister ? 'Login' : 'Register'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
