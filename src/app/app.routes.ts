import { Routes } from '@angular/router';
import { Intro } from './pages/intro/intro';
import { Identification } from './pages/identification/identification';
import { Scheduling } from './pages/scheduling/scheduling';
import { Finish } from './pages/finish/finish';

export const routes: Routes = [
  {
    path: '',
    component: Intro
  },
  {
    path: 'identificacao',
    component: Identification
  },
  {
    path: 'agendamento',
    component: Scheduling
  },
  {
    path: 'finish',
    component: Finish
  }
];
