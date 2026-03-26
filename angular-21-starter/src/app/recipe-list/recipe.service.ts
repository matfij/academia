import { computed, Injectable, signal } from '@angular/core';
import { CAPRESE_SALAD, SPAGHETTI_CARBONARA } from '../mock-recipes';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  protected readonly recipes = signal([SPAGHETTI_CARBONARA, CAPRESE_SALAD]);

  getRecipes(searchTerm: string) {
    return this.recipes().filter((recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }
}
