import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import packageJson from '../../../../../package.json';
import { ThemeService } from '../../../core/services/theme.service';

// "14:32 GMT+2" — the author's wall-clock time, shown so visitors in other
// timezones know whether a reply is likely. Built once: the options are constant
// and the formatter is re-used every second.
const TIME_FORMAT = new Intl.DateTimeFormat('en', {
  timeZone: 'Europe/Rome',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
});

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer implements OnDestroy {
  readonly year = new Date().getFullYear();
  readonly version: string = packageJson.version;
  readonly theme = inject(ThemeService);
  readonly localTime = signal(TIME_FORMAT.format(new Date()));

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // The initial value above is computed during prerendering, so the static HTML
    // ships the *build* time — accepted so the slot isn't visibly empty on first
    // paint; hydration corrects it within a second. Only the ticking interval is
    // browser-only, so the prerender doesn't leave a timer running.
    afterNextRender(() => {
      this.timer = setInterval(() => this.localTime.set(TIME_FORMAT.format(new Date())), 1000);
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
