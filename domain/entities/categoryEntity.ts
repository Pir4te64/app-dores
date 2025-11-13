export class Category {
  id: number;
  name: string;
  description: string;
  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.description = category.description;
  }
}
