import { afterNextRender, ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EMAIL } from './core/data/social-links';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { BackToTop } from './shared/components/back-to-top/back-to-top';

const BADGE_STYLE = [
  'font-size: 2.2rem',
  'font-weight: 900',
  'color: #fff',
  'background: #7c6ef5',
  'padding: 0.1em 0.35em',
  'border-radius: 4px',
  'font-family: JetBrains Mono, monospace',
].join('; ');

const CARD_STYLE =
  'font-size: 0.85rem; color: #888; font-family: JetBrains Mono, monospace; line-height: 2;';

/**
 * Application shell: skip link, header, routed outlet, footer, back-to-top.
 * Holds no page state — everything routed lives under features/.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslatePipe, Header, Footer, BackToTop],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    // Easter egg for anyone who opens devtools. Browser-only — it would be noise
    // in the prerender logs otherwise.
    afterNextRender(() => {
      console.log('%c gc. ', BADGE_STYLE);
      console.log(
        '%cGabriele Cabrini — Fullstack Software Developer\n\n' +
          `📧  ${EMAIL.name}\n` +
          '💼  linkedin.com/in/gabrielecabrini\n' +
          '🐙  github.com/gabrielecabrini\n\n' +
          'Feel free to say hi — always happy to connect.',
        CARD_STYLE,
      );
    });
  }
}
