import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrderStatus } from './models';
import { RecipeList } from './recipe-list/recipe-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RecipeList],
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App {
  protected readonly title = signal('Healthy Recipe Box');
  protected readonly subtitle = signal('Fresh seasonal meals in minutes');
  protected readonly status = signal<OrderStatus>('Preparing');

  protected startCooking() {
    console.log('Cooking started!');
    this.status.set('Cooking');
  }

  protected resetStatus() {
    console.log('Cooking stopped!');
    this.status.set('Preparing');
  }
}
