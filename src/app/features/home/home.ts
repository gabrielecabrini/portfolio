import { afterNextRender, ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GithubActivity } from './github-activity/github-activity';
import { SOCIAL_LINKS } from '../../core/data/social-links';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslatePipe, GithubActivity],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnDestroy {
  readonly displayText = signal('');
  readonly email = SOCIAL_LINKS.find(l => l.href.startsWith('mailto:'))!.href;

  private readonly phrases = [
    'Fullstack Software Developer',
    'Spring Boot & Kotlin Developer',
    'Angular Developer',
    'Linux & Open Source Enthusiast',
    'Flutter Developer',
  ];
  private phraseIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => this.tick());
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }

  private tick(): void {
    const phrase = this.phrases[this.phraseIndex];

    if (!this.deleting) {
      this.charIndex++;
      this.displayText.set(phrase.slice(0, this.charIndex));
      if (this.charIndex === phrase.length) {
        this.timer = setTimeout(() => { this.deleting = true; this.tick(); }, 1800);
        return;
      }
    } else {
      this.charIndex--;
      this.displayText.set(phrase.slice(0, this.charIndex));
      if (this.charIndex === 0) {
        this.deleting = false;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        this.timer = setTimeout(() => this.tick(), 400);
        return;
      }
    }

    this.timer = setTimeout(() => this.tick(), this.deleting ? 40 : 80);
  }
}
