export type OrderStatus = 'Preparing' | 'Cooking';

export interface RecipeModel {
  name: string;
  description: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  name: string;
  quantity: string;
}
