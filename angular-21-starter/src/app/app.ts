import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrderStatus, RecipeModel } from './models';
import { CAPRESE_SALAD } from './mock-recipes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App {
  protected readonly title = signal('Healthy Recipe Box');
  protected readonly subtitle = signal('Fresh seasonal meals in minutes');
  protected readonly recipe = signal<RecipeModel>(CAPRESE_SALAD);
  protected readonly status = signal<OrderStatus>('Preparing');
  protected readonly servings = signal(4);
  protected readonly scaledIngredients = computed(() => {
    const factor = this.servings() / 4;
    return this.recipe().ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: `${factor * parseFloat(ingredient.quantity)} ${ingredient.quantity.split(' ')[1] || ''}`,
    }));
  });

  protected startCooking() {
    console.log('Cooking started!');
    this.status.set('Cooking');
  }

  protected resetStatus() {
    console.log('Cooking stopped!');
    this.status.set('Preparing');
  }

  protected incrementServings() {
    this.servings.update((prev) => prev + 1);
  }

  protected decrementServings() {
    this.servings.update((prev) => Math.max(1, prev - 1));
  }
}
