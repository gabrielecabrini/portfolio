import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  constructor() {
    inject(SeoService).setRobots('noindex, nofollow');
  }
}
