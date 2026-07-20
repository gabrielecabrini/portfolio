import { afterNextRender, ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { BackToTop } from './shared/components/back-to-top/back-to-top';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslatePipe, Header, Footer, BackToTop],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    afterNextRender(() => {
      console.log(
        '%c gc. ',
        [
          'font-size: 2.2rem',
          'font-weight: 900',
          'color: #fff',
          'background: #7c6ef5',
          'padding: 0.1em 0.35em',
          'border-radius: 4px',
          'font-family: JetBrains Mono, monospace',
        ].join('; '),
      );
      console.log(
        '%cGabriele Cabrini — Fullstack Software Developer\n\n' +
        '📧  gabriele.cabrini@proton.me\n' +
        '💼  linkedin.com/in/gabrielecabrini\n' +
        '🐙  github.com/gabrielecabrini\n\n' +
        'Feel free to say hi — always happy to connect.',
        'font-size: 0.85rem; color: #888; font-family: JetBrains Mono, monospace; line-height: 2;',
      );
    });
  }
}
