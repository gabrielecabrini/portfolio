import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-blog-not-found',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './blog-not-found.html',
  styleUrl: './blog-not-found.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogNotFound {
  constructor() {
    inject(SeoService).setRobots('noindex, nofollow');
  }
}
