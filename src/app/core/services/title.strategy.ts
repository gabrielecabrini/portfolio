import { effect, inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { I18nService, instantText } from './i18n.service';
import { SeoService } from './seo.service';

export const SITE = 'Gabriele Cabrini';

/**
 * Resolves route `title` values as i18n keys and re-applies them on a language
 * switch. A key with no translation falls through to the raw string, which is why
 * a literal title like `'CV'` works without a `title.*` entry (see app.routes.ts).
 *
 * Doubles as the hook for canonical/hreflang tags, since it's the one place that
 * sees every navigation with its final URL.
 */
@Injectable({ providedIn: 'root' })
export class TranslateTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);
  private readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  private currentKey: string | undefined;

  constructor() {
    super();
    effect(() => {
      this.i18n.lang(); // re-apply title when language switches
      this.applyTitle(this.currentKey);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.currentKey = this.buildTitle(snapshot);
    this.applyTitle(this.currentKey);
    this.seo.setCanonical(snapshot.url);
  }

  // Resolved synchronously: translations are bundled and loaded up-front (see
  // InlineTranslateLoader in app.config.ts), so there is nothing to await. The
  // previous promise-based version could also apply a stale title, since two quick
  // navigations resolved in completion order rather than navigation order.
  private applyTitle(key: string | undefined): void {
    this.title.setTitle(key ? `${instantText(this.translate, key)} — ${SITE}` : SITE);
  }
}
