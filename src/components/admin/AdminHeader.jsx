import React from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../contexts/AdminContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBell, FiUser, FiLogOut } = FiIcons;

const AdminHeader = () => {
  const { admin, logoutAdmin } = useAdmin();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">BB</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-primary">
                BusyBites Admin
              </h1>
              <p className="text-xs text-text-secondary">
                Content Management System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiBell} className="w-5 h-5 text-text-secondary" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-highlight rounded-full"></span>
            </motion.button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="w-4 h-4 text-text-secondary" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-text-primary">{admin?.name}</p>
                <p className="text-text-secondary">{admin?.role}</p>
              </div>
            </div>

            <motion.button
              onClick={logoutAdmin}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiLogOut} className="w-5 h-5 text-text-secondary" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;