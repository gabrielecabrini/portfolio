import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EMAIL, SOCIAL_LINKS } from '../../core/data/social-links';
import { SocialLink } from '../../core/models/social-link.model';
import { applyPageSeo } from '../../core/services/page-seo';
import { SITE_ORIGIN } from '../../core/services/seo.service';
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
    applyPageSeo({
      descriptionKey: 'about.seo.description',
      socialTitle: 'About — Gabriele Cabrini',
      jsonLd: (description) => ({
        id: 'ld-about',
        data: {
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
        },
      }),
    });
  }
}
