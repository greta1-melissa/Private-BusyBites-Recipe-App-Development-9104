import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiBell, FiMenu, FiUser } = FiIcons;

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'BusyBites';
      case '/recipes':
        return 'Recipes';
      case '/profile':
        return 'Profile';
      case '/settings':
        return 'Settings';
      default:
        return 'BusyBites';
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-sm border-b border-gray-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-white font-bold text-sm">BB</span>
            </motion.div>
            <div>
              <h1 className="text-lg font-semibold text-text-primary">
                {getPageTitle()}
              </h1>
              <p className="text-xs text-text-secondary">
                For Hectic Days and Hungry Nights
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiSearch} className="w-5 h-5 text-text-secondary" />
            </motion.button>

            <motion.button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiBell} className="w-5 h-5 text-text-secondary" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-highlight rounded-full"></span>
            </motion.button>

            {/* User Avatar */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="w-4 h-4 text-primary" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;