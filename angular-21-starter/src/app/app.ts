import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

type OrderStatus = 'Preparing' | 'Cooking';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App {
  protected readonly title = signal('Healthy Recipe Box');
  protected readonly subtitle = signal('Fresh seasonal meals in minutes');
  protected readonly status = signal<OrderStatus>('Preparing');

  protected startCooking() {
    console.log('Cooking started!');
    this.status.update(() => 'Cooking');
  }

  protected resetStatus() {
    console.log('Cooking stopped!');
    this.status.update(() => 'Preparing');
  }
}
