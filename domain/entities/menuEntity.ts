export interface MenuImage {
  id: number;
  name: string;
  type: string;
  url: string;
}

interface Category {
  id: number;
  name: string;
  urlImage: string | null;
}

interface DietaryRestriction {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface MenuItem {
  id: number;
  commerceId: number;
  name: string;
  description: string;
  price: number;
  stock: boolean;
  image: MenuImage[];
  category: Category;
  dietaryRestrictions: DietaryRestriction[];
}

export interface MenuResponse {
  content: Menu[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export class Menu {
  id: number;
  commerceId: number;
  name: string;
  description: string;
  price: number;
  stock: boolean;
  image: MenuImage[];
  category: Category;
  dietaryRestrictions: DietaryRestriction[];

  constructor(data: MenuItem) {
    this.id = data.id;
    this.commerceId = data.commerceId;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.stock = data.stock;
    this.image = data.image || [];
    this.category = data.category;
    this.dietaryRestrictions = data.dietaryRestrictions || [];
  }
}
