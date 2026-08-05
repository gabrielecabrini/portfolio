import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GithubActivity } from './github-activity/github-activity';
import { EMAIL } from '../../core/data/social-links';
import { applyPageSeo } from '../../core/services/page-seo';

// Job titles cycled by the hero typewriter. Not translated: they're the English
// role names used on LinkedIn/CV in both languages.
const PHRASES = [
  'Fullstack Software Developer',
  'Spring Boot & Kotlin Developer',
  'Angular Developer',
  'Linux & Open Source Enthusiast',
  'Flutter Developer',
];

// Typewriter timings, in milliseconds.
const TYPE_MS = 80; // per character while typing
const DELETE_MS = 40; // per character while deleting (deliberately faster)
const HOLD_FULL_MS = 1800; // pause on the complete phrase before deleting
const HOLD_EMPTY_MS = 400; // pause on the empty line before the next phrase

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslatePipe, GithubActivity],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnDestroy {
  readonly displayText = signal('');
  readonly email = EMAIL.href;

  private phraseIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    applyPageSeo({
      descriptionKey: 'home.tagline',
      socialTitle: 'Gabriele Cabrini — Fullstack Software Developer',
    });

    // Browser-only: prerendered HTML ships an empty line rather than a frozen
    // half-typed phrase.
    afterNextRender(() => this.tick());
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }

  /**
   * One frame of the typewriter: reveals or hides a single character, then
   * schedules the next frame. Phase transitions (typing → hold → deleting →
   * next phrase) happen at the string boundaries and each get their own longer
   * pause, so the cursor visibly rests instead of bouncing.
   */
  private tick(): void {
    const phrase = PHRASES[this.phraseIndex];
    // Unreachable: phraseIndex is always kept modulo PHRASES.length. Returning
    // (rather than defaulting to '') means a future off-by-one stops the animation
    // instead of spinning setTimeout on an empty string forever.
    if (phrase === undefined) return;

    if (!this.deleting) {
      this.charIndex++;
      this.displayText.set(phrase.slice(0, this.charIndex));
      if (this.charIndex === phrase.length) {
        this.timer = setTimeout(() => {
          this.deleting = true;
          this.tick();
        }, HOLD_FULL_MS);
        return;
      }
    } else {
      this.charIndex--;
      this.displayText.set(phrase.slice(0, this.charIndex));
      if (this.charIndex === 0) {
        this.deleting = false;
        this.phraseIndex = (this.phraseIndex + 1) % PHRASES.length;
        this.timer = setTimeout(() => this.tick(), HOLD_EMPTY_MS);
        return;
      }
    }

    this.timer = setTimeout(() => this.tick(), this.deleting ? DELETE_MS : TYPE_MS);
  }
}
