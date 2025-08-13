import { Routes } from '@angular/router';
import { Intro } from './pages/intro/intro';
import { Identification } from './pages/identification/identification';

export const routes: Routes = [
  {
    path: '',
    component: Intro
  },
  {
    path: 'identificacao',
    component: Identification
  }
];
