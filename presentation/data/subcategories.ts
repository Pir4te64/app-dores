// Sistema de subcategorías para cada categoría principal
export interface Subcategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  parentCategory: string;
}

// Mapeo de categorías principales a sus subcategorías
export const SUBCATEGORIES: Record<string, Subcategory[]> = {
  // DESAYUNO
  'desayuno': [
    {
      id: 'cafe',
      name: 'Café',
      description: 'Café, té, bebidas calientes',
      icon: 'Coffee',
      color: '#8B4513',
      parentCategory: 'desayuno'
    },
    {
      id: 'panaderia',
      name: 'Panadería',
      description: 'Pan, croissants, pasteles',
      icon: 'CircleDot',
      color: '#D2691E',
      parentCategory: 'desayuno'
    },
    {
      id: 'frutas',
      name: 'Frutas',
      description: 'Frutas frescas y jugos',
      icon: 'Apple',
      color: '#32CD32',
      parentCategory: 'desayuno'
    },
    {
      id: 'huevos',
      name: 'Huevos',
      description: 'Huevos revueltos, fritos, omelettes',
      icon: 'Circle',
      color: '#FFD700',
      parentCategory: 'desayuno'
    }
  ],

  // ALMUERZO
  'almuerzo': [
    {
      id: 'pizza',
      name: 'Pizza',
      description: 'Pizzas de todos los sabores',
      icon: 'CircleDot',
      color: '#E17055',
      parentCategory: 'almuerzo'
    },
    {
      id: 'hamburguesas',
      name: 'Hamburguesas',
      description: 'Hamburguesas clásicas y gourmet',
      icon: 'Beef',
      color: '#D63031',
      parentCategory: 'almuerzo'
    },
    {
      id: 'pasta',
      name: 'Pasta',
      description: 'Pastas italianas y más',
      icon: 'Flame',
      color: '#E84393',
      parentCategory: 'almuerzo'
    },
    {
      id: 'sandwich',
      name: 'Sandwich',
      description: 'Sandwiches y wraps',
      icon: 'Square',
      color: '#FDCB6E',
      parentCategory: 'almuerzo'
    },
    {
      id: 'ensaladas',
      name: 'Ensaladas',
      description: 'Ensaladas frescas y saludables',
      icon: 'Leaf',
      color: '#00B894',
      parentCategory: 'almuerzo'
    },
    {
      id: 'sopas',
      name: 'Sopas',
      description: 'Sopas y caldos',
      icon: 'CircleDot',
      color: '#A29BFE',
      parentCategory: 'almuerzo'
    }
  ],

  // CENA
  'cena': [
    {
      id: 'sushi',
      name: 'Sushi',
      description: 'Sushi y comida japonesa',
      icon: 'Fish',
      color: '#74B9FF',
      parentCategory: 'cena'
    },
    {
      id: 'mariscos',
      name: 'Mariscos',
      description: 'Camarones, langosta, pescado',
      icon: 'Fish',
      color: '#74B9FF',
      parentCategory: 'cena'
    },
    {
      id: 'carnes',
      name: 'Carnes',
      description: 'Carnes a la parrilla y asadas',
      icon: 'Beef',
      color: '#D63031',
      parentCategory: 'cena'
    },
    {
      id: 'vegetariano',
      name: 'Vegetariano',
      description: 'Opciones vegetarianas',
      icon: 'Carrot',
      color: '#00B894',
      parentCategory: 'cena'
    },
    {
      id: 'mexicana',
      name: 'Mexicana',
      description: 'Tacos, burritos, quesadillas',
      icon: 'Star',
      color: '#FDCB6E',
      parentCategory: 'cena'
    }
  ],

  // POSTRES
  'postres': [
    {
      id: 'helados',
      name: 'Helados',
      description: 'Helados y sorbetes',
      icon: 'CircleDot',
      color: '#87CEEB',
      parentCategory: 'postres'
    },
    {
      id: 'tortas',
      name: 'Tortas',
      description: 'Tortas y pasteles',
      icon: 'Cake',
      color: '#FD79A8',
      parentCategory: 'postres'
    },
    {
      id: 'chocolate',
      name: 'Chocolate',
      description: 'Postres de chocolate',
      icon: 'Circle',
      color: '#8B4513',
      parentCategory: 'postres'
    },
    {
      id: 'frutas',
      name: 'Frutas',
      description: 'Postres con frutas',
      icon: 'Apple',
      color: '#32CD32',
      parentCategory: 'postres'
    }
  ],

  // BEBIDAS
  'bebidas': [
    {
      id: 'refrescos',
      name: 'Refrescos',
      description: 'Gaseosas y refrescos',
      icon: 'CircleDot',
      color: '#FF6B6B',
      parentCategory: 'bebidas'
    },
    {
      id: 'jugos',
      name: 'Jugos',
      description: 'Jugos naturales y licuados',
      icon: 'Apple',
      color: '#32CD32',
      parentCategory: 'bebidas'
    },
    {
      id: 'alcohol',
      name: 'Alcohol',
      description: 'Cerveza, vino, licores',
      icon: 'Wine',
      color: '#8B4513',
      parentCategory: 'bebidas'
    },
    {
      id: 'cafe',
      name: 'Café',
      description: 'Café y bebidas calientes',
      icon: 'Coffee',
      color: '#8B4513',
      parentCategory: 'bebidas'
    }
  ]
};

// Función para obtener subcategorías por categoría principal
export const getSubcategoriesByCategory = (categoryName: string): Subcategory[] => {
  const normalizedName = categoryName.toLowerCase();
  return SUBCATEGORIES[normalizedName] || [];
};

// Función para obtener una subcategoría específica
export const getSubcategoryById = (categoryName: string, subcategoryId: string): Subcategory | null => {
  const subcategories = getSubcategoriesByCategory(categoryName);
  return subcategories.find(sub => sub.id === subcategoryId) || null;
};
