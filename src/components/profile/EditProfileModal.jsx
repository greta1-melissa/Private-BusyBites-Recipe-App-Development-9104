import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';
import SafeIcon from '../../common/SafeIcon';
import { useToast } from '../../contexts/ToastContext';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiX } = FiIcons;

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    skillLevel: user?.preferences?.skillLevel || 'beginner',
    cookingTime: user?.preferences?.cookingTime || 30,
    dietaryRestrictions: user?.preferences?.dietaryRestrictions || [],
  });

  const skillLevels = ['beginner', 'intermediate', 'advanced'];
  const timeOptions = [15, 30, 45, 60];
  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDietaryChange = (dietary) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(dietary)
        ? prev.dietaryRestrictions.filter(item => item !== dietary)
        : [...prev.dietaryRestrictions, dietary]
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        error('Image size should be less than 5MB');
        return;
      }

      try {
        // For now, we'll use a simple FileReader for preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            avatar: reader.result
          }));
        };
        reader.readAsDataURL(file);
      } catch (err) {
        error('Failed to upload image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      success('Profile updated successfully');
      onClose();
    } catch (err) {
      error('Failed to update profile');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <SafeIcon icon={FiUpload} className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <SafeIcon icon={FiUpload} className="w-4 h-4" />
            </label>
          </div>
          <p className="text-sm text-text-secondary mt-2">
            Click to upload new avatar
          </p>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Enter your name"
          />
        </div>

        {/* Skill Level */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Skill Level
          </label>
          <div className="flex space-x-2">
            {skillLevels.map((level) => (
              <button
                type="button"
                key={level}
                onClick={() => handleChange({ target: { name: 'skillLevel', value: level } })}
                className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                  formData.skillLevel === level
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Cooking Time */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Preferred Cooking Time (minutes)
          </label>
          <div className="flex space-x-2">
            {timeOptions.map((time) => (
              <button
                type="button"
                key={time}
                onClick={() => handleChange({ target: { name: 'cookingTime', value: time } })}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  formData.cookingTime === time
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                {time}m
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Dietary Restrictions
          </label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((dietary) => (
              <button
                type="button"
                key={dietary}
                onClick={() => handleDietaryChange(dietary)}
                className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                  formData.dietaryRestrictions.includes(dietary)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                {dietary.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;