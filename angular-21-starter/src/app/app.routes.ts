import { Routes } from '@angular/router';
import { Home } from './home/home';
import { RecipeList } from './recipe-list/recipe-list';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'recipes', component: RecipeList },
  { path: '**', component: Home },
];
