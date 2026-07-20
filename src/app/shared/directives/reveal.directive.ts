import { afterNextRender, Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnDestroy {
  readonly revealDelay = input('0ms');
  readonly revealOnce = input(true);

  private readonly el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => {
      const el = this.el.nativeElement as HTMLElement;
      let initialized = false;

      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!initialized) {
              initialized = true;
              if (!entry.isIntersecting) {
                el.classList.add('reveal-pending');
              } else if (this.revealOnce()) {
                this.observer?.disconnect();
              }
              continue;
            }
            if (entry.isIntersecting) {
              // Set inline transition to win over component-scoped CSS specificity,
              // then clear it after reveal so hover transitions work normally.
              el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
              el.style.transitionDelay = this.revealDelay();
              el.classList.remove('reveal-pending');
              el.classList.add('reveal-visible');
              el.addEventListener('transitionend', () => {
                el.style.transition = '';
                el.style.transitionDelay = '';
              }, { once: true });
              if (this.revealOnce()) this.observer?.disconnect();
            }
          }
        },
        { threshold: 0.12 },
      );

      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
