import { ChangeDetectionStrategy, Component, computed, effect, inject, PLATFORM_ID, resource } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/common';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { BLOG_POSTS } from '../../../core/data/blog.registry';
import { I18nService } from '../../../core/services/i18n.service';
import { SeoService, SITE_ORIGIN } from '../../../core/services/seo.service';
import { Lang } from '../../../core/models/blog-post.model';
import { SITE } from '../../../core/services/title.strategy';

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
}));

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, DatePipe, TranslatePipe],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPost {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly i18n = inject(I18nService);
  private readonly title = inject(Title);
  private readonly seo = inject(SeoService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly lang = this.i18n.lang;
  readonly #slug = toSignal(this.route.paramMap.pipe(map(p => p.get('slug'))));

  // True only for Angular's first-ever navigation (hard load / hydration, id 1) — a
  // missing id is treated the same way so we default to showing rather than hiding
  // the prerendered header.
  readonly #isInitialNav = (this.router.currentNavigation()?.id ?? 1) === 1;

  constructor() {
    // Registry data (title/excerpt/date/tags) is synchronous, unlike the markdown body,
    // so it's reliably present in the prerendered HTML — this is what search engines see.
    effect(() => {
      const post = this.post();
      const translation = this.translation();
      if (!post || !translation) return;

      const fullTitle = `${translation.title} — ${SITE_ORIGIN}`;
      this.title.setTitle(fullTitle);
      this.seo.setSocialTitle(fullTitle);
      this.seo.setDescription(translation.excerpt);
      this.seo.setType('article');
      this.seo.setArticleMeta(post.date, post.tags);
      this.seo.setJsonLd('blog-posting-jsonld', {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: translation.title,
        description: translation.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        url: `${SITE_ORIGIN}/blog/${post.slug}`,
        inLanguage: this.i18n.lang(),
        keywords: post.tags.join(', '),
        author: { '@type': 'Person', name: SITE, url: SITE_ORIGIN },
        publisher: { '@type': 'Person', name: SITE, url: SITE_ORIGIN },
      });
    });
  }

  readonly post = computed(() => BLOG_POSTS.find(p => p.slug === this.#slug()));

  readonly translation = computed(() => {
    const post = this.post();
    if (!post) return null;
    const lang = this.i18n.lang() as Lang;
    return post.translations[lang] ?? post.translations[post.langs[0]];
  });

  readonly contentResource = resource({
    params: () => ({ slug: this.#slug(), lang: this.i18n.lang() }),
    loader: async ({ params: { slug, lang }, abortSignal }): Promise<SafeHtml | undefined> => {
      if (!slug || !this.isBrowser) return undefined;
      const response = await fetch(`/assets/blog/${slug}/${lang}.md`, { signal: abortSignal });
      // Missing assets can 200 with the SPA's own index.html (dev-server /
      // static-host history fallback) instead of a real 404 — that fallback is
      // always served as text/html, never a real .md, so the header tells us
      // apart from actual content without inspecting the body.
      if (response.headers.get('content-type')?.includes('text/html')) {
        throw new Error('markdown asset missing: got app shell instead');
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const raw = await response.text();
      return this.sanitizer.bypassSecurityTrustHtml(marked.parse(raw) as string);
    },
  });

  // In-app navigation waits for the Markdown to resolve so header + body reveal
  // together with one entrance animation, instead of the header popping in first and
  // the body stretching the layout when it lands. A hard load/hydration always shows.
  readonly ready = computed(() => this.#isInitialNav || !this.contentResource.isLoading());
}
