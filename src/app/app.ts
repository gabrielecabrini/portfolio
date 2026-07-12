import { Component } from '@angular/core';
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
})
export class App {}
