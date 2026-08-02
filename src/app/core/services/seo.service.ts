import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { SUPPORTED_LANGS } from './i18n.service';

export const SITE_ORIGIN = 'https://www.gabrielecabrini.it';

// Low-level writer for the document <head>. It only knows how to set tags; deciding
// *what* a page should advertise is the caller's job — see page-seo.ts for the
// per-page helper that feature components use instead of calling this directly.
// Tags that never vary per route (og:type, og:image, twitter:card) are static in
// src/index.html and deliberately have no setter here.
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);

  // Canonical + hreflang alternates + og:url for the given route path (e.g. '/about').
  // Every route shares the same URL across languages (the language toggle doesn't
  // change the path), so all hreflang variants point at the same href.
  setCanonical(path: string): void {
    const url = this.absoluteUrl(path);
    this.setLinkTag('canonical', url);
    for (const hreflang of SUPPORTED_LANGS) this.setLinkTag('alternate', url, hreflang);
    this.setLinkTag('alternate', url, 'x-default');
    this.meta.updateTag({ property: 'og:url', content: url });
  }

  setDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  setSocialTitle(title: string): void {
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });
  }

  setRobots(content: string): void {
    this.meta.updateTag({ name: 'robots', content });
  }

  // Upserts a <script type="application/ld+json"> keyed by id, so re-running on a
  // language switch replaces the payload instead of appending a second block.
  setJsonLd(id: string, data: unknown): void {
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  // Upserts a <link> keyed by rel (+ hreflang when given). Angular's Meta service
  // only manages <meta>, so link tags are handled by hand.
  private setLinkTag(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]:not([hreflang])`;
    let link = this.document.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.rel = rel;
      if (hreflang) link.hreflang = hreflang;
      this.document.head.appendChild(link);
    }
    link.href = href;
  }

  private absoluteUrl(path: string): string {
    return `${SITE_ORIGIN}${path || '/'}`;
  }
}
