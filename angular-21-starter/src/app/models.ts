export type OrderStatus = 'Preparing' | 'Cooking';

export interface RecipeModel {
  name: string;
  description: string;
  ingredients: Ingredient[];
  imgUrl: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
}
