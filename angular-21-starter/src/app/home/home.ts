import { Component, signal } from '@angular/core';
import { OrderStatus } from '../models';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.sass',
})
export class Home {
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
