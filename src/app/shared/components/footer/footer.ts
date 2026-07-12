import { afterNextRender, ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import packageJson from '../../../../../package.json';
import { ThemeService } from '../../../core/services/theme.service';

const TZ = 'Europe/Rome';

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
  readonly localTime = signal(this.formatTime(new Date()));

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    afterNextRender(() => {
      this.timer = setInterval(() => this.localTime.set(this.formatTime(new Date())), 1000);
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private formatTime(date: Date): string {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: TZ,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    }).formatToParts(date);
    const h = parts.find(p => p.type === 'hour')?.value ?? '';
    const m = parts.find(p => p.type === 'minute')?.value ?? '';
    const tz = parts.find(p => p.type === 'timeZoneName')?.value ?? '';
    return `${h}:${m} ${tz}`;
  }
}
