import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PROJECTS } from '../../../core/data/projects';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-projects-list',
  imports: [TranslatePipe],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsList {
  readonly projects: Project[] = PROJECTS;
}
