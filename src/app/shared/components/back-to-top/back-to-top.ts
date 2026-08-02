import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

// Scroll distance after which the button appears.
const SHOW_AFTER_PX = 300;
// Scroll events fire far more often than the single threshold check needs; ~20Hz
// is plenty and keeps the handler off the main thread's critical path.
const SCROLL_THROTTLE_MS = 50;

@Component({
  selector: 'app-back-to-top',
  imports: [TranslatePipe],
  templateUrl: './back-to-top.html',
  styleUrl: './back-to-top.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTop {
  readonly visible = signal(false);
  private readonly footerVisible = signal(false);
  private lastScrollTime = 0;

  // Lift the (fixed-position) button above the footer once the footer is on
  // screen, so it never overlaps the links there.
  readonly bottomStyle = computed(() =>
    this.footerVisible() ? 'calc(var(--footer-h) + 1.25rem)' : '',
  );

  constructor() {
    const destroyRef = inject(DestroyRef);

    // afterNextRender never runs during prerendering, so everything below is
    // browser-only by construction — no isPlatformBrowser guards needed.
    afterNextRender(() => {
      const footer = document.querySelector('footer');
      if (!footer) return;

      const observer = new IntersectionObserver(
        ([entry]) => this.footerVisible.set(entry.isIntersecting),
        { threshold: 0 },
      );
      observer.observe(footer);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const now = Date.now();
    if (now - this.lastScrollTime < SCROLL_THROTTLE_MS) return;
    this.lastScrollTime = now;
    this.visible.set(window.scrollY > SHOW_AFTER_PX);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
