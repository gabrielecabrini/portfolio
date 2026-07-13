import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-blog-not-found',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './blog-not-found.html',
  styleUrl: './blog-not-found.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogNotFound {}
