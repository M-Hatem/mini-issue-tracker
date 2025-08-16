import { Routes } from '@angular/router';
import ISSUES_ROUTES from './features/issues/issues.routes';
import { NotFound } from './shared/ui/views/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'issues',
    pathMatch: 'full',
  },
  ...ISSUES_ROUTES,
  {
    path: '**',
    component: NotFound,
    title: 'Page Not Found',
  },
];
