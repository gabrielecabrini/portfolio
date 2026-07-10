import { ChangeDetectionStrategy, Component, computed, HostListener, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.html',
  styleUrl: './back-to-top.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTop implements OnInit, OnDestroy {
  readonly visible = signal(false);
  private readonly footerVisible = signal(false);
  private observer?: IntersectionObserver;

  readonly bottomStyle = computed(() =>
    this.footerVisible() ? 'calc(60px + 1.25rem)' : ''
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
    this.visible.set(window.scrollY > 300);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
