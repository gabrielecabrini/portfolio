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
    path: 'cv',
    loadComponent: () => import('./features/cv/cv').then(m => m.Cv),
    title: 'CV',
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog-list/blog-list').then(m => m.BlogList),
    title: 'Blog',
  },
  {
    path: 'blog/not-found',
    loadComponent: () => import('./features/blog/blog-not-found/blog-not-found').then(m => m.BlogNotFound),
    title: 'Blog',
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./features/blog/blog-post/blog-post').then(m => m.BlogPost),
    title: 'Blog',
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound),
    title: 'title.notFound',
  },
];
