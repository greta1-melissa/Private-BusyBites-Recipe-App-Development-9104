import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiX } = FiIcons;

const PrivacyNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem('busybites_privacy_notice');
    if (!hasSeenNotice) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('busybites_privacy_notice', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-surface rounded-lg p-6 max-w-md w-full shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiShield} className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-text-primary">
                  Privacy Notice
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            
            <div className="space-y-3 text-text-secondary">
              <p>
                This is a private application designed for internal use only.
              </p>
              <p>
                🔒 This app is hidden from search engines and not publicly indexed.
              </p>
              <p>
                🛡️ All data is stored locally and not shared with external services.
              </p>
              <p>
                📱 Designed for authorized users only with secure access controls.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyNotice;