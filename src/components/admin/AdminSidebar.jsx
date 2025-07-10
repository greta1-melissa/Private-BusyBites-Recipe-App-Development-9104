import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiBook, FiUsers, FiImage, FiSettings, FiBarChart3 } = FiIcons;

const AdminSidebar = () => {
  const navItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
    { path: '/admin/recipes', icon: FiBook, label: 'Recipes' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/media', icon: FiImage, label: 'Media' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <motion.nav
      className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <SafeIcon
                    icon={item.icon}
                    className={`w-5 h-5 ${isActive ? 'text-white' : 'text-text-secondary'}`}
                  />
                  <span className={`font-medium ${isActive ? 'text-white' : 'text-text-secondary'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default AdminSidebar;