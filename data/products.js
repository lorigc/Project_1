// Pizza shop menu. Pizzas are priced per size; sides/drinks/desserts have a flat price.
const items = [
  {
    id: 1,
    category: 'pizza',
    name: 'Margherita',
    description: 'Tomato, fresh mozzarella, basil, olive oil.',
    emoji: '🍕',
    sizes: [
      { id: 'small', label: 'Small 10"', price: 9.99 },
      { id: 'medium', label: 'Medium 12"', price: 12.99 },
      { id: 'large', label: 'Large 14"', price: 15.99 }
    ],
    tags: ['classic', 'vegetarian']
  },
  {
    id: 2,
    category: 'pizza',
    name: 'Pepperoni',
    description: 'Loaded pepperoni, mozzarella, tomato sauce.',
    emoji: '🍕',
    sizes: [
      { id: 'small', label: 'Small 10"', price: 11.49 },
      { id: 'medium', label: 'Medium 12"', price: 14.49 },
      { id: 'large', label: 'Large 14"', price: 17.49 }
    ],
    tags: ['classic', 'meat', 'bestseller']
  },
  {
    id: 3,
    category: 'pizza',
    name: 'BBQ Chicken',
    description: 'Grilled chicken, BBQ sauce, red onion, cilantro.',
    emoji: '🍗',
    sizes: [
      { id: 'small', label: 'Small 10"', price: 12.49 },
      { id: 'medium', label: 'Medium 12"', price: 15.49 },
      { id: 'large', label: 'Large 14"', price: 18.49 }
    ],
    tags: ['chicken', 'bbq']
  },
  {
    id: 4,
    category: 'pizza',
    name: 'Veggie Supreme',
    description: 'Bell pepper, mushroom, olives, onion, tomato.',
    emoji: '🥬',
    sizes: [
      { id: 'small', label: 'Small 10"', price: 10.99 },
      { id: 'medium', label: 'Medium 12"', price: 13.99 },
      { id: 'large', label: 'Large 14"', price: 16.99 }
    ],
    tags: ['vegetarian', 'veggie']
  },
  {
    id: 5,
    category: 'pizza',
    name: 'Meat Lovers',
    description: 'Pepperoni, sausage, bacon, ham, mozzarella.',
    emoji: '🥓',
    sizes: [
      { id: 'small', label: 'Small 10"', price: 13.49 },
      { id: 'medium', label: 'Medium 12"', price: 16.49 },
      { id: 'large', label: 'Large 14"', price: 19.49 }
    ],
    tags: ['meat', 'bestseller']
  },
  {
    id: 6,
    category: 'pizza',
    name: 'Hawaiian',
    description: 'Ham, pineapple, mozzarella, tomato sauce.',
    emoji: '🍍',
    sizes: [
      { id: 'small', label: 'Small 10"', price: 11.49 },
      { id: 'medium', label: 'Medium 12"', price: 14.49 },
      { id: 'large', label: 'Large 14"', price: 17.49 }
    ],
    tags: ['sweet', 'ham']
  },
  {
    id: 7,
    category: 'side',
    name: 'Garlic Knots',
    description: '6 knots baked with garlic butter and parmesan.',
    emoji: '🥨',
    price: 5.49,
    tags: ['garlic', 'bread']
  },
  {
    id: 8,
    category: 'side',
    name: 'Mozzarella Sticks',
    description: '8 golden-fried sticks with marinara dip.',
    emoji: '🧀',
    price: 6.99,
    tags: ['cheese', 'fried']
  },
  {
    id: 9,
    category: 'side',
    name: 'Caesar Salad',
    description: 'Romaine, croutons, parmesan, caesar dressing.',
    emoji: '🥗',
    price: 7.49,
    tags: ['salad', 'fresh']
  },
  {
    id: 10,
    category: 'drink',
    name: 'Cola',
    description: 'Ice-cold 500ml bottle.',
    emoji: '🥤',
    price: 2.49,
    tags: ['soda']
  },
  {
    id: 11,
    category: 'drink',
    name: 'Sparkling Water',
    description: 'Chilled 500ml bottle.',
    emoji: '💧',
    price: 1.99,
    tags: ['water']
  },
  {
    id: 12,
    category: 'dessert',
    name: 'Chocolate Brownie',
    description: 'Warm fudge brownie, serves two.',
    emoji: '🍫',
    price: 4.99,
    tags: ['chocolate', 'sweet']
  },
  {
    id: 13,
    category: 'dessert',
    name: 'Cinnamon Twists',
    description: 'Sugar-dusted twists with icing dip.',
    emoji: '🥐',
    price: 4.49,
    tags: ['cinnamon', 'sweet']
  }
];

// Extra toppings available on any pizza.
const toppings = [
  { id: 'extra-cheese', name: 'Extra Cheese', price: 1.5 },
  { id: 'pepperoni', name: 'Pepperoni', price: 1.75 },
  { id: 'mushrooms', name: 'Mushrooms', price: 1.25 },
  { id: 'onions', name: 'Red Onions', price: 1.0 },
  { id: 'olives', name: 'Black Olives', price: 1.25 },
  { id: 'jalapenos', name: 'Jalapeños', price: 1.0 },
  { id: 'bacon', name: 'Bacon', price: 2.0 },
  { id: 'pineapple', name: 'Pineapple', price: 1.5 }
];

module.exports = { items, toppings };
