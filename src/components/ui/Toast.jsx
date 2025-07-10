import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiX, FiAlertCircle, FiInfo } = FiIcons;

const Toast = ({ toasts, removeToast }) => {
  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return FiCheck;
      case 'error': return FiX;
      case 'warning': return FiAlertCircle;
      case 'info': return FiInfo;
      default: return FiInfo;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center p-4 rounded-lg border shadow-lg min-w-[300px] ${getToastStyles(toast.type)}`}
          >
            <SafeIcon icon={getToastIcon(toast.type)} className="w-5 h-5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{toast.message}</p>
              {toast.description && (
                <p className="text-sm opacity-90">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 p-1 hover:bg-black/10 rounded-full transition-colors"
            >
              <SafeIcon icon={FiX} className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;