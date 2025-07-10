import React from 'react';
import { motion } from 'framer-motion';

const NutritionChart = ({ nutrition }) => {
  const nutritionData = [
    { label: 'Protein', value: nutrition.protein, color: 'bg-blue-500', unit: 'g' },
    { label: 'Carbs', value: nutrition.carbs, color: 'bg-green-500', unit: 'g' },
    { label: 'Fat', value: nutrition.fat, color: 'bg-yellow-500', unit: 'g' },
    { label: 'Fiber', value: nutrition.fiber, color: 'bg-purple-500', unit: 'g' }
  ];

  const totalMacros = nutrition.protein + nutrition.carbs + nutrition.fat;

  return (
    <div className="bg-surface rounded-lg p-6">
      <h3 className="font-semibold text-text-primary mb-4">Nutrition per serving</h3>
      
      {/* Calories */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-primary">{nutrition.calories}</div>
        <div className="text-sm text-text-secondary">calories</div>
      </div>

      {/* Macronutrients Chart */}
      <div className="space-y-4">
        {nutritionData.map((item, index) => {
          const percentage = totalMacros > 0 ? (item.value / totalMacros) * 100 : 0;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-text-primary">{item.label}</span>
                <span className="text-sm text-text-secondary">
                  {item.value}{item.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Fiber:</span>
            <span className="ml-2 font-medium text-text-primary">{nutrition.fiber}g</span>
          </div>
          <div>
            <span className="text-text-secondary">Total:</span>
            <span className="ml-2 font-medium text-text-primary">{totalMacros}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;