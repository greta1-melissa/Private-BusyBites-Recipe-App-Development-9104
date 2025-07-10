import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiClock, FiShield, FiBell, FiMoon, FiGlobe, FiCheck } = FiIcons;

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { success, error: showError } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    skillLevel: user?.preferences?.skillLevel || 'intermediate',
    cookingTime: user?.preferences?.cookingTime || 30,
    dietaryRestrictions: user?.preferences?.dietaryRestrictions || [],
    notifications: user?.preferences?.notifications ?? true,
    darkMode: user?.preferences?.darkMode ?? false,
    language: user?.preferences?.language || 'en',
  });

  const skillLevels = ['beginner', 'intermediate', 'advanced'];
  const timeOptions = [15, 30, 45, 60];
  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'];

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDietaryChange = (dietary) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(dietary)
        ? prev.dietaryRestrictions.filter(item => item !== dietary)
        : [...prev.dietaryRestrictions, dietary],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateUser({
        preferences: {
          skillLevel: preferences.skillLevel,
          cookingTime: preferences.cookingTime,
          dietaryRestrictions: preferences.dietaryRestrictions,
          notifications: preferences.notifications,
          darkMode: preferences.darkMode,
          language: preferences.language,
        },
      });
      
      if (result.success) {
        success('Settings saved successfully!', 'Your preferences have been updated.');
      } else {
        showError('Failed to save settings', result.error);
      }
    } catch (err) {
      showError('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6">
        <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {/* Welcome Banner */}
          {!user?.preferences?.skillLevel && (
            <motion.div 
              className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold mb-2">Welcome to BusyBites!</h3>
              <p className="text-white/90 mb-2">
                Please take a moment to set your cooking preferences to get personalized recipes.
              </p>
              <div className="flex items-center text-white/90">
                <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                <span>Your account has been successfully created</span>
              </div>
            </motion.div>
          )}

          {/* Profile Settings */}
          <motion.div className="bg-surface rounded-lg p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center space-x-3 mb-4">
              <SafeIcon icon={FiUser} className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text-primary">Profile Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Skill Level
                </label>
                <div className="flex space-x-2">
                  {skillLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => handlePreferenceChange('skillLevel', level)}
                      className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                        preferences.skillLevel === level
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Preferred Cooking Time
                </label>
                <div className="flex space-x-2">
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      onClick={() => handlePreferenceChange('cookingTime', time)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        preferences.cookingTime === time
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                      }`}
                    >
                      {time}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Dietary Restrictions
                </label>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((dietary) => (
                    <button
                      key={dietary}
                      onClick={() => handleDietaryChange(dietary)}
                      className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                        preferences.dietaryRestrictions.includes(dietary)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                      }`}
                    >
                      {dietary.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div className="bg-surface rounded-lg p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center space-x-3 mb-4">
              <SafeIcon icon={FiBell} className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text-primary">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-primary">Push Notifications</span>
                <button
                  onClick={() => handlePreferenceChange('notifications', !preferences.notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.notifications ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      preferences.notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* App Settings */}
          <motion.div className="bg-surface rounded-lg p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center space-x-3 mb-4">
              <SafeIcon icon={FiGlobe} className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text-primary">App Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-primary">Dark Mode</span>
                <button
                  onClick={() => handlePreferenceChange('darkMode', !preferences.darkMode)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.darkMode ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      preferences.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-primary">Language</span>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div className="bg-surface rounded-lg p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center space-x-3 mb-4">
              <SafeIcon icon={FiShield} className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text-primary">Privacy & Security</h3>
            </div>
            <div className="space-y-3 text-sm text-text-secondary">
              <p>🔒 This app is private and hidden from search engines</p>
              <p>📱 Data is stored locally on your device</p>
              <p>🛡️ No personal information is shared with third parties</p>
              <p>🔐 Secure authentication and session management</p>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSaving ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              'Save Settings'
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;