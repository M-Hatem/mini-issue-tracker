import { Routes } from '@angular/router';

const ISSUES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
];

export default ISSUES_ROUTES;
