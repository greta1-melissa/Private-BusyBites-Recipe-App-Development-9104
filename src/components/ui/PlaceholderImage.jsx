import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiImage, FiUser, FiBook, FiChef } = FiIcons;

const PlaceholderImage = ({ 
  type = 'recipe', 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const getIcon = () => {
    switch (type) {
      case 'recipe':
        return FiBook;
      case 'user':
        return FiUser;
      case 'chef':
        return FiChef;
      default:
        return FiImage;
    }
  };

  const getText = () => {
    switch (type) {
      case 'recipe':
        return 'Recipe';
      case 'user':
        return 'User';
      case 'chef':
        return 'Chef';
      default:
        return 'Image';
    }
  };

  return (
    <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center rounded-lg ${className}`}>
      <SafeIcon 
        icon={getIcon()} 
        className={`${iconSizes[size]} text-gray-400 mb-2`} 
      />
      {showText && (
        <span className="text-xs text-gray-500 font-medium">
          {getText()}
        </span>
      )}
    </div>
  );
};

export default PlaceholderImage;