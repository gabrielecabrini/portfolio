import { ChangeDetectionStrategy, Component, computed, HostListener, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-back-to-top',
  imports: [TranslatePipe],
  templateUrl: './back-to-top.html',
  styleUrl: './back-to-top.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTop implements OnInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly visible = signal(false);
  private readonly footerVisible = signal(false);
  private observer?: IntersectionObserver;
  private lastScrollTime = 0;

  readonly bottomStyle = computed(() =>
    this.footerVisible() ? 'calc(var(--footer-h) + 1.25rem)' : ''
  );

  ngOnInit(): void {
    if (!this.isBrowser) return;
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
    if (!this.isBrowser) return;
    const now = Date.now();
    if (now - this.lastScrollTime < 50) return;
    this.lastScrollTime = now;
    this.visible.set(window.scrollY > 300);
  }

  scrollToTop(): void {
    if (this.isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
