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
    path: 'cv',
    loadComponent: () => import('./features/cv/cv').then(m => m.Cv),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound),
  },
];
