import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BLOG_POSTS } from '../../../core/data/blog.registry';

export const blogPostGuard: CanActivateFn = (route) => {
  const slug = route.paramMap.get('slug');
  if (BLOG_POSTS.some(p => p.slug === slug)) return true;
  return inject(Router).createUrlTree(['/blog', 'not-found']);
};
