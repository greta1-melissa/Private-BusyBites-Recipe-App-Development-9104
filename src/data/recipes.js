// Define the base recipes array
export const recipesData = [
  {
    id: '1',
    title: '5-Minute Avocado Toast',
    description: 'Quick and nutritious breakfast perfect for busy mornings',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'breakfast',
    difficulty: 'easy',
    cookingTime: 5,
    prepTime: 3,
    servings: 1,
    calories: 320,
    dietary: ['vegetarian', 'gluten-free'],
    tags: ['quick', 'healthy', 'breakfast', 'vegetarian'],
    ingredients: [
      { name: 'Avocado', amount: '1', unit: 'whole' },
      { name: 'Bread slice', amount: '1', unit: 'piece' },
      { name: 'Lemon juice', amount: '1', unit: 'tsp' },
      { name: 'Salt', amount: '1/4', unit: 'tsp' },
      { name: 'Black pepper', amount: '1/8', unit: 'tsp' },
      { name: 'Red pepper flakes', amount: '1/8', unit: 'tsp' }
    ],
    instructions: [
      'Toast the bread slice until golden brown',
      'Cut avocado in half, remove pit, and mash with fork',
      'Mix mashed avocado with lemon juice, salt, and pepper',
      'Spread avocado mixture on toast',
      'Sprinkle with red pepper flakes',
      'Serve immediately'
    ],
    nutrition: {
      calories: 320,
      protein: 8,
      carbs: 28,
      fat: 22,
      fiber: 12
    },
    rating: 4.8,
    reviews: 1234,
    author: 'Chef Maria',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '7',
    title: 'Asian Lettuce Wraps',
    description: 'Light and flavorful lettuce wraps with crispy vegetables',
    image: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752202708649-AR-JF-71722-Asian-Lettuce-Wraps-4x3-fb109ce7164f4faf9a67f5e388a26dbb.jpg',
    category: 'lunch',
    difficulty: 'easy',
    cookingTime: 10,
    prepTime: 15,
    servings: 2,
    calories: 285,
    dietary: ['gluten-free', 'dairy-free'],
    tags: ['healthy', 'fresh', 'asian', 'light'],
    ingredients: [
      { name: 'Butter lettuce', amount: '8', unit: 'leaves' },
      { name: 'Ground chicken', amount: '1', unit: 'lb' },
      { name: 'Water chestnuts', amount: '1', unit: 'can' },
      { name: 'Carrots', amount: '2', unit: 'medium' },
      { name: 'Green onions', amount: '3', unit: 'stalks' },
      { name: 'Soy sauce', amount: '3', unit: 'tbsp' },
      { name: 'Sesame oil', amount: '1', unit: 'tbsp' },
      { name: 'Ginger', amount: '1', unit: 'tbsp' },
      { name: 'Garlic', amount: '2', unit: 'cloves' }
    ],
    instructions: [
      'Cook ground chicken in a large skillet until browned',
      'Add diced water chestnuts and carrots',
      'Stir in soy sauce, sesame oil, ginger, and garlic',
      'Cook for 3-4 minutes until vegetables are tender',
      'Remove from heat and add green onions',
      'Serve in lettuce cups with additional soy sauce'
    ],
    nutrition: {
      calories: 285,
      protein: 28,
      carbs: 12,
      fat: 14,
      fiber: 4
    },
    rating: 4.6,
    reviews: 567,
    author: 'Chef Lin',
    createdAt: '2024-01-09T11:20:00Z'
  }
];