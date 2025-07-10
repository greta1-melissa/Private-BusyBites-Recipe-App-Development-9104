import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import Modal from '../ui/Modal';
import { useToast } from '../../contexts/ToastContext';
import * as FiIcons from 'react-icons/fi';

const { FiShoppingCart, FiCheck, FiTrash2, FiPlus, FiShare } = FiIcons;

const ShoppingList = ({ isOpen, onClose, recipe }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const { success } = useToast();

  const handleToggleItem = (index, isCustom = false) => {
    const key = isCustom ? `custom-${index}` : `ingredient-${index}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      setCustomItems(prev => [...prev, { name: newItem.trim(), amount: '1', unit: 'item' }]);
      setNewItem('');
      success('Item added to shopping list');
    }
  };

  const handleRemoveCustomItem = (index) => {
    setCustomItems(prev => prev.filter((_, i) => i !== index));
    // Also remove from checked items
    setCheckedItems(prev => {
      const newChecked = { ...prev };
      delete newChecked[`custom-${index}`];
      return newChecked;
    });
  };

  const handleShareList = () => {
    const allItems = [
      ...recipe.ingredients.map(ing => `${ing.amount} ${ing.unit} ${ing.name}`),
      ...customItems.map(item => `${item.amount} ${item.unit} ${item.name}`)
    ];
    
    const listText = `Shopping List for ${recipe.title}:\n\n${allItems.join('\n')}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Shopping List - ${recipe.title}`,
        text: listText
      });
    } else {
      navigator.clipboard.writeText(listText);
      success('Shopping list copied to clipboard');
    }
  };

  const getCheckedCount = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  const getTotalItems = () => {
    return recipe.ingredients.length + customItems.length;
  };

  if (!recipe) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shopping List" size="lg">
      <div className="space-y-6">
        {/* Header with progress */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text-primary">{recipe.title}</h3>
            <p className="text-sm text-text-secondary">
              {getCheckedCount()} of {getTotalItems()} items checked
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareList}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-text-secondary rounded-lg hover:bg-gray-200 transition-colors"
            >
              <SafeIcon icon={FiShare} className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(getCheckedCount() / getTotalItems()) * 100}%` }}
          />
        </div>

        {/* Recipe Ingredients */}
        <div>
          <h4 className="font-medium text-text-primary mb-3">Recipe Ingredients</h4>
          <div className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <motion.div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  checkedItems[`ingredient-${index}`]
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <button
                  onClick={() => handleToggleItem(index)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    checkedItems[`ingredient-${index}`]
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {checkedItems[`ingredient-${index}`] && (
                    <SafeIcon icon={FiCheck} className="w-3 h-3" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={`font-medium ${
                    checkedItems[`ingredient-${index}`]
                      ? 'text-green-800 line-through'
                      : 'text-text-primary'
                  }`}>
                    {ingredient.name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {ingredient.amount} {ingredient.unit}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Custom Items */}
        <div>
          <h4 className="font-medium text-text-primary mb-3">Additional Items</h4>
          
          {/* Add new item form */}
          <form onSubmit={handleAddCustomItem} className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add custom item..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
            </button>
          </form>

          {/* Custom items list */}
          <div className="space-y-2">
            {customItems.map((item, index) => (
              <motion.div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  checkedItems[`custom-${index}`]
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
              >
                <button
                  onClick={() => handleToggleItem(index, true)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    checkedItems[`custom-${index}`]
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {checkedItems[`custom-${index}`] && (
                    <SafeIcon icon={FiCheck} className="w-3 h-3" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={`font-medium ${
                    checkedItems[`custom-${index}`]
                      ? 'text-green-800 line-through'
                      : 'text-text-primary'
                  }`}>
                    {item.name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {item.amount} {item.unit}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveCustomItem(index)}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShoppingList;