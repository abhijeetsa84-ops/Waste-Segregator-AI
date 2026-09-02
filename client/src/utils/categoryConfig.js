// Category configuration — colours, icons (emoji), descriptions, and bin instructions
export const CATEGORIES = {
  ORGANIC: {
    id: 'ORGANIC',
    label: 'Wet / Organic',
    emoji: '🥦',
    binColor: 'Green Bin',
    colorClass: 'green',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-600',
    glow: 'shadow-sm',
    bar: 'bg-green-500',
    description: 'Biodegradable & compostable waste',
    examples: ['Food scraps', 'Vegetable/fruit peels', 'Garden waste', 'Tea/coffee waste', 'Leftovers']
  },
  RECYCLABLE: {
    id: 'RECYCLABLE',
    label: 'Dry / Recyclable',
    emoji: '♻️',
    binColor: 'Blue Bin',
    colorClass: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-600',
    glow: 'shadow-sm',
    bar: 'bg-blue-500',
    description: 'Clean dry materials for recycling',
    examples: ['Paper & cardboard', 'Plastic bottles', 'Glass jars', 'Metal cans', 'Tin foil']
  },
  HAZARDOUS: {
    id: 'HAZARDOUS',
    label: 'Hazardous Waste',
    emoji: '⚠️',
    binColor: 'Red Bin',
    colorClass: 'red',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-600',
    glow: 'shadow-sm',
    bar: 'bg-red-500',
    description: 'Dangerous materials requiring special disposal',
    examples: ['Batteries', 'Paints & chemicals', 'Expired medicine', 'Fluorescent bulbs', 'Motor oil']
  },
  'E-WASTE': {
    id: 'E-WASTE',
    label: 'E-Waste',
    emoji: '💻',
    binColor: 'E-Waste Centre',
    colorClass: 'purple',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    badge: 'bg-purple-600',
    glow: 'shadow-sm',
    bar: 'bg-purple-500',
    description: 'Electronic & electrical equipment',
    examples: ['Phones & tablets', 'Computers', 'Cables & chargers', 'Circuit boards', 'Batteries (Li-ion)']
  },
  SANITARY: {
    id: 'SANITARY',
    label: 'Sanitary Waste',
    emoji: '🩺',
    binColor: 'Yellow Bin',
    colorClass: 'yellow',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-600',
    glow: 'shadow-sm',
    bar: 'bg-amber-500',
    description: 'Bio-medical & personal hygiene waste',
    examples: ['Used masks', 'Diapers', 'Sanitary pads', 'Used bandages', 'Medical gloves']
  },
  RESIDUAL: {
    id: 'RESIDUAL',
    label: 'Residual / Inert',
    emoji: '🪨',
    binColor: 'Grey Bin',
    colorClass: 'gray',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    text: 'text-gray-700',
    badge: 'bg-gray-600',
    glow: 'shadow-sm',
    bar: 'bg-gray-500',
    description: 'Non-recyclable general waste',
    examples: ['Ceramics', 'Construction rubble', 'Styrofoam', 'Contaminated items', 'Mixed waste']
  }
};

export const getCategoryConfig = (categoryId) => {
  return CATEGORIES[categoryId] || CATEGORIES.RESIDUAL;
};
