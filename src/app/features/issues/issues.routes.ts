import { Routes } from '@angular/router';

const ISSUES_ROUTES: Routes = [
  {
    path: 'issues',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'new',
        loadComponent: () => import('./form/form').then((m) => m.Form),
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./form/form').then((m) => m.Form),
      },
      {
        path: ':id',
        loadComponent: () => import('./details/details').then((m) => m.Details),
      },
    ],
  },
];

export default ISSUES_ROUTES;
