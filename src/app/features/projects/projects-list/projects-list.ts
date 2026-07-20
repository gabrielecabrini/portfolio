import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PROJECTS } from '../../../core/data/projects';
import { Project } from '../../../core/models/project.model';
import { I18nService } from '../../../core/services/i18n.service';
import { SeoService, SITE_ORIGIN } from '../../../core/services/seo.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-projects-list',
  imports: [TranslatePipe, RevealDirective],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsList {
  readonly projects: Project[] = PROJECTS;

  constructor() {
    const seo = inject(SeoService);
    const translate = inject(TranslateService);
    const i18n = inject(I18nService);

    effect(() => {
      i18n.lang();
      seo.setDescription(translate.instant('projects.subtitle'));
      seo.setSocialTitle(`Projects — Gabriele Cabrini`);
      seo.setType('website');
      seo.setJsonLd('ld-projects', {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: translate.instant('projects.title'),
        url: `${SITE_ORIGIN}/projects`,
        itemListElement: PROJECTS.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: translate.instant(p.titleKey),
          ...(p.repoUrl ? { url: p.repoUrl } : {}),
        })),
      });
    });
  }
}
