import { Routes } from '@angular/router';
import { Home } from './features/home/home';

export const routes: Routes = [
  // Home is eager — keeps FCP fast for the landing page
  { path: '', component: Home },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then(m => m.About),
  },
  {
    path: 'experience',
    loadComponent: () => import('./features/experience/experience').then(m => m.Experience),
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects-list/projects-list').then(m => m.ProjectsList),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound),
  },
];
