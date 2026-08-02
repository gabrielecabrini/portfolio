import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

const COLUMNS = 7; // one per weekday, like GitHub's own grid
const CELL_COUNT = 140; // 20 weeks
const LEVELS = 5; // 0 = empty … 4 = busiest, styled via [data-level]

// Cascade: cells light up column by column, with a small extra offset down each
// column, giving the grid a diagonal sweep on entry.
const COLUMN_DELAY_MS = 35;
const ROW_DELAY_MS = 8;

/**
 * Deterministic 0..LEVELS-1 value for a cell. Not Math.random(): the grid is
 * prerendered, and a random draw would produce one pattern in the static HTML and
 * a different one after hydration, repainting the whole block on first paint.
 * The hash just needs to look unpatterned — it carries no real data.
 */
function levelFor(index: number): number {
  const noise = Math.sin(index * 12.9898) * 43758.5453;
  return Math.floor((noise - Math.floor(noise)) * LEVELS);
}

/**
 * Purely decorative GitHub-style contribution heatmap in the hero section.
 * It is aria-hidden and shows no real contribution data.
 */
@Component({
  selector: 'app-github-activity',
  imports: [TranslatePipe],
  templateUrl: './github-activity.html',
  styleUrl: './github-activity.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubActivity {
  readonly gridItems = Array.from({ length: CELL_COUNT }, (_, i) => ({
    level: levelFor(i),
    delay: `${Math.floor(i / COLUMNS) * COLUMN_DELAY_MS + (i % COLUMNS) * ROW_DELAY_MS}ms`,
  }));
}
