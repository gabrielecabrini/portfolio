import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-github-activity',
  templateUrl: './github-activity.html',
  styleUrl: './github-activity.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubActivity {
  readonly gridItems = Array.from({ length: 140 }, (_, i) => ({
    level: Math.floor(Math.random() * 5),
    delay: `${Math.floor(i / 7) * 35 + (i % 7) * 8}ms`,
  }));
}
