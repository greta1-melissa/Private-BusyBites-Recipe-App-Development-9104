import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../contexts/AdminContext';
import { Navigate } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useToast } from '../../contexts/ToastContext';

const { FiMail, FiLock, FiEye, FiEyeOff, FiShield } = FiIcons;

const AdminLogin = () => {
  const { loginAdmin, isAuthenticated } = useAdmin();
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    console.log('Submitting admin login form...', formData);

    try {
      const result = await loginAdmin(formData);
      console.log('Admin login result:', result);
      
      if (!result.success) {
        setError(result.error || 'Login failed');
        showError('Login Failed', result.error || 'Invalid credentials');
      } else {
        success('Login successful!', 'Welcome to Admin Dashboard');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('An unexpected error occurred: ' + err.message);
      showError('System Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fillTestCredentials = () => {
    setFormData({
      email: 'admin@busybites.com',
      password: 'admin123'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <SafeIcon icon={FiShield} className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            BusyBites Admin
          </h1>
          <p className="text-text-secondary text-lg">
            Secure Admin Access Portal
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-xl backdrop-blur-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 rounded-lg p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-3">
                Admin Email
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiMail}
                  className="absolute left-4 top-4 w-5 h-5 text-text-secondary"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="Enter admin email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-3">
                Password
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiLock}
                  className="absolute left-4 top-4 w-5 h-5 text-text-secondary"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-14 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <SafeIcon
                    icon={showPassword ? FiEyeOff : FiEye}
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In to Admin Panel'
              )}
            </motion.button>
          </form>

          {/* Demo Credentials Button */}
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-secondary">Demo Access</span>
              </div>
            </div>
            <button 
              onClick={fillTestCredentials}
              className="mt-4 w-full text-primary text-sm font-medium hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 py-3 rounded-lg border border-primary/20"
            >
              📝 Use Demo Credentials
            </button>
          </div>

          {/* Credentials Info */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Email:</strong> admin@busybites.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <SafeIcon icon={FiShield} className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-text-primary">Secure Admin Portal</span>
            </div>
            <div className="text-xs text-text-secondary space-y-1">
              <p>🔒 Role-based access control</p>
              <p>🛡️ Protected and monitored for security</p>
              <p>📊 Full system management capabilities</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;