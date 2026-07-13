import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BLOG_POSTS } from '../../../core/data/blog.registry';
import { I18nService } from '../../../core/services/i18n.service';
import { Lang } from '../../../core/models/blog-post.model';

@Component({
  selector: 'app-blog-list',
  imports: [TranslatePipe, DatePipe, RouterLink],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogList {
  private readonly i18n = inject(I18nService);
  readonly lang = this.i18n.lang;

  readonly query = signal('');

  readonly filteredPosts = computed(() => {
    const q = this.query().toLowerCase().trim();
    const lang = this.i18n.lang() as Lang;
    if (!q) return BLOG_POSTS;
    return BLOG_POSTS.filter(post =>
      post.translations[lang]?.title.toLowerCase().includes(q)
    );
  });

  translation(post: (typeof BLOG_POSTS)[number]) {
    return post.translations[this.i18n.lang() as Lang] ?? post.translations[post.langs[0]];
  }
}
