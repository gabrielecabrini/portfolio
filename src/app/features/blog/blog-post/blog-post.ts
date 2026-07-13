import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, catchError, map, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { marked } from 'marked';
import { DatePipe } from '@angular/common';
import { BLOG_POSTS } from '../../../core/data/blog.registry';
import { I18nService } from '../../../core/services/i18n.service';
import { Lang } from '../../../core/models/blog-post.model';

type ContentState = { status: 'loading' } | { status: 'error' } | { status: 'ok'; html: SafeHtml };

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPost {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly i18n = inject(I18nService);

  readonly lang = this.i18n.lang;
  readonly #slug = toSignal(this.route.paramMap.pipe(map(p => p.get('slug'))));

  constructor() {
    effect(() => {
      if (this.#slug() != null && !this.post()) {
        this.router.navigate(['/blog', 'not-found'], { replaceUrl: true });
      }
    });
  }

  readonly post = computed(() => BLOG_POSTS.find(p => p.slug === this.#slug()));

  readonly translation = computed(() => {
    const post = this.post();
    if (!post) return null;
    const lang = this.i18n.lang() as Lang;
    return post.translations[lang] ?? post.translations[post.langs[0]];
  });

  readonly contentState = toSignal<ContentState>(
    toObservable(computed(() => ({ slug: this.#slug(), lang: this.i18n.lang() }))).pipe(
      switchMap(({ slug, lang }) => {
        if (!slug) return of<ContentState>({ status: 'loading' });
        return this.http.get(`/assets/blog/${slug}/${lang}.md`, { responseType: 'text' }).pipe(
          map(raw => ({
            status: 'ok' as const,
            html: this.sanitizer.bypassSecurityTrustHtml(marked.parse(raw) as string),
          })),
          catchError(() => of<ContentState>({ status: 'error' })),
          startWith<ContentState>({ status: 'loading' }),
        );
      }),
      startWith<ContentState>({ status: 'loading' }),
    ),
    { requireSync: true }
  );
}
