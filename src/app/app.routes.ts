import { Routes } from '@angular/router';
import { Home } from './features/home/home';

export const routes: Routes = [
  // Home is eager — keeps FCP fast for the landing page
  { path: '', component: Home },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then(m => m.About),
    title: 'title.about',
  },
  {
    path: 'experience',
    loadComponent: () => import('./features/experience/experience').then(m => m.Experience),
    title: 'title.experience',
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects-list/projects-list').then(m => m.ProjectsList),
    title: 'title.projects',
  },
  {
    // 'CV' is deliberately literal, not a `title.*` i18n key: the word is identical
    // in it/en, and TranslateTitleStrategy falls back to the raw key string when
    // ngx-translate has no matching translation, so this "just works".
    path: 'cv',
    loadComponent: () => import('./features/cv/cv').then(m => m.Cv),
    title: 'CV',
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound),
    title: 'title.notFound',
  },
];
