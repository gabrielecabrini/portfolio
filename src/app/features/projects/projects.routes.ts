import { Routes } from '@angular/router';

export const projectsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./projects-list/projects-list').then(m => m.ProjectsList),
  },
];
