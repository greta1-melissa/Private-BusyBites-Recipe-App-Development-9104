import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNavigation from './navigation/BottomNavigation';
import Header from './navigation/Header';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.main
        className="pb-20 pt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;