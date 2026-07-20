import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EMAIL, SOCIAL_LINKS } from '../../core/data/social-links';
import { SocialLink } from '../../core/models/social-link.model';
import { I18nService } from '../../core/services/i18n.service';
import { SeoService, SITE_ORIGIN } from '../../core/services/seo.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [TranslatePipe, RouterLink, RevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  readonly links: SocialLink[] = SOCIAL_LINKS;
  readonly email = EMAIL.href;

  constructor() {
    const seo = inject(SeoService);
    const translate = inject(TranslateService);
    const i18n = inject(I18nService);

    effect(() => {
      i18n.lang();
      const description = translate.instant('about.seo.description');
      seo.setDescription(description);
      seo.setSocialTitle(`About — Gabriele Cabrini`);
      seo.setType('website');
      seo.setJsonLd('ld-about', {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About — Gabriele Cabrini',
        description,
        url: `${SITE_ORIGIN}/about`,
        mainEntity: {
          '@type': 'Person',
          name: 'Gabriele Cabrini',
          url: SITE_ORIGIN,
        },
      });
    });
  }
}
