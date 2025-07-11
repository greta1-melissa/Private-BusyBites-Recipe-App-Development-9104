import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiBook, FiUser, FiSettings } = FiIcons;

const BottomNavigation = () => {
  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/recipes', icon: FiBook, label: 'Recipes' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-100 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary/10 scale-105'
                  : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className={`w-6 h-6 mb-1 ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                  <SafeIcon
                    icon={item.icon}
                    className="w-full h-full"
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? 'text-primary' : 'text-text-secondary'
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;