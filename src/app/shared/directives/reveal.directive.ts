import { afterNextRender, Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';

// Applied inline (not via a stylesheet) so it beats component-scoped CSS, then
// cleared after the reveal so the element's own hover transitions work normally.
const REVEAL_TRANSITION = 'opacity 0.45s ease, transform 0.45s ease';
// Fraction of the element that must be on screen before it counts as revealed.
const VISIBILITY_THRESHOLD = 0.12;

/**
 * Fades + slides an element in the first time it scrolls into view.
 *
 * Elements that are already on screen at load are left untouched (no
 * `reveal-pending`, no animation) so above-the-fold content paints immediately
 * instead of flashing in — that's what the first-callback branch below handles.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective implements OnDestroy {
  /** CSS transition-delay, for staggering a list of siblings. */
  readonly revealDelay = input('0ms');
  /** When false the element re-animates every time it re-enters the viewport. */
  readonly revealOnce = input(true);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => {
      const el = this.el.nativeElement;

      // IntersectionObserver always fires once on observe(). That first callback
      // reports the initial position and must not animate anything.
      let initialized = false;

      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!initialized) {
              initialized = true;
              if (!entry.isIntersecting) {
                // Off screen at load: hide it now so it has something to fade in from.
                el.classList.add('reveal-pending');
              } else if (this.revealOnce()) {
                // Already visible at load: nothing to reveal, stop watching.
                this.observer?.disconnect();
              }
              continue;
            }

            if (entry.isIntersecting) {
              el.style.transition = REVEAL_TRANSITION;
              el.style.transitionDelay = this.revealDelay();
              el.classList.remove('reveal-pending');
              el.classList.add('reveal-visible');
              el.addEventListener(
                'transitionend',
                () => {
                  el.style.transition = '';
                  el.style.transitionDelay = '';
                },
                { once: true },
              );
              if (this.revealOnce()) this.observer?.disconnect();
            }
          }
        },
        { threshold: VISIBILITY_THRESHOLD },
      );

      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
