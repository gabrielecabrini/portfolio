import { ChangeDetectionStrategy, Component, computed, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-back-to-top',
  imports: [TranslatePipe],
  templateUrl: './back-to-top.html',
  styleUrl: './back-to-top.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTop implements OnInit, OnDestroy {
  readonly visible = signal(false);
  private readonly footerVisible = signal(false);
  private observer?: IntersectionObserver;
  private lastScrollTime = 0;

  readonly bottomStyle = computed(() =>
    this.footerVisible() ? 'calc(var(--footer-h) + 1.25rem)' : ''
  );

  ngOnInit(): void {
    const footer = document.querySelector('footer');
    if (!footer) return;
    this.observer = new IntersectionObserver(
      ([entry]) => this.footerVisible.set(entry.isIntersecting),
      { threshold: 0 }
    );
    this.observer.observe(footer);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const now = Date.now();
    if (now - this.lastScrollTime < 50) return;
    this.lastScrollTime = now;
    this.visible.set(window.scrollY > 300);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
