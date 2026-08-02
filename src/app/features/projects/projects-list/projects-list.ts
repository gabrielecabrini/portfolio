import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PROJECTS } from '../../../core/data/projects';
import { Project } from '../../../core/models/project.model';
import { applyPageSeo } from '../../../core/services/page-seo';
import { SITE_ORIGIN } from '../../../core/services/seo.service';
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
    const translate = inject(TranslateService);

    applyPageSeo({
      descriptionKey: 'projects.subtitle',
      socialTitle: 'Projects — Gabriele Cabrini',
      // Mirrors the visible list as schema.org ItemList so search engines index the
      // projects individually. Re-evaluated per language, hence instant() is fine.
      jsonLd: () => ({
        id: 'ld-projects',
        data: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: translate.instant('projects.title'),
          url: `${SITE_ORIGIN}/projects`,
          itemListElement: PROJECTS.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: translate.instant(project.titleKey),
            ...(project.repoUrl ? { url: project.repoUrl } : {}),
          })),
        },
      }),
    });
  }
}
