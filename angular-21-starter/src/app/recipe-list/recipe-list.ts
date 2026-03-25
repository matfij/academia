import { Component, computed, signal } from '@angular/core';
import { RecipeModel } from '../models';
import { CAPRESE_SALAD, SPAGHETTI_CARBONARA } from '../mock-recipes';

@Component({
  selector: 'app-recipe-list',
  imports: [],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.sass',
})
export class RecipeList {
  protected readonly currentRecipe = signal<RecipeModel>(CAPRESE_SALAD);
  protected readonly servings = signal(4);
  protected readonly adjustedIngredients = computed(() => {
    const factor = this.servings() / 4;
    return this.currentRecipe().ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: `${factor * parseFloat(ingredient.quantity)} ${ingredient.quantity.split(' ')[1] || ''}`,
    }));
  });
  protected readonly showDetails = signal(true);
  protected readonly recipes = signal([SPAGHETTI_CARBONARA, CAPRESE_SALAD]);

  protected incrementServings() {
    this.servings.update((prev) => prev + 1);
  }

  protected decrementServings() {
    this.servings.update((prev) => Math.max(1, prev - 1));
  }

  protected toggleDetails() {
    this.showDetails.update((prev) => !prev);
  }

  protected setRecipe(newRecipe: RecipeModel) {
    this.currentRecipe.set(newRecipe);
  }
}
