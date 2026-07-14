import { effect, inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from './i18n.service';
import { SeoService } from './seo.service';

export const SITE = 'Gabriele Cabrini';

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

  private applyTitle(key: string | undefined): void {
    if (!key) {
      this.title.setTitle(SITE);
      return;
    }
    this.translate.get(key).subscribe(label => {
      this.title.setTitle(`${label} — ${SITE}`);
    });
  }
}
