import { Component, computed, inject, signal } from '@angular/core';
import { RecipeModel } from '../models';
import { CAPRESE_SALAD, SPAGHETTI_CARBONARA } from '../mock-recipes';
import { FormsModule } from '@angular/forms';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipe-list',
  imports: [FormsModule],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.sass',
})
export class RecipeList {
  private readonly recipesService = inject(RecipeService);

  protected readonly searchTerm = signal('');
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
  protected readonly filteredRecipes = computed(() => this.recipesService.getRecipes(this.searchTerm()));

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
