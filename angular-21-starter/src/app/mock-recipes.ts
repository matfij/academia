import { RecipeModel } from './models';

export const SPAGHETTI_CARBONARA: RecipeModel = {
  name: 'Spaghetti carbonara',
  description:
    'Carbonara is a pasta dish made with fatty cured pork, hard cheese, eggs, salt, and black pepper. It is typical of the Lazio region of Italy. The dish took its modern form and name in the middle of the 20th century. The cheese used is usually pecorino romano.',
  ingredients: [
    { name: 'pasta', quantity: '500 grams' },
    { name: 'guanciale', quantity: '100 grams' },
    { name: 'pecorino romano', quantity: '100 grams' },
    { name: 'eggs', quantity: '1' },
    { name: 'black pepper', quantity: 'handful' },
    { name: 'salt', quantity: '1 tablespoon' },
  ],
};

export const CAPRESE_SALAD: RecipeModel = {
  name: 'Caprese salad',
  description: `Caprese salad is an Italian salad composed of sliced fresh mozzarella, tomatoes, and basil, seasoned with salt and olive oil. The salad's name references the island of Capri, where it is believed to have originated.`,
  ingredients: [
    { name: 'mozzarella', quantity: '250 grams' },
    { name: 'tomatoes', quantity: '2' },
    { name: 'basil', quantity: '5 leafs' },
    { name: 'EVOO', quantity: '50 ml' },
  ],
};
