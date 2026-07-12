import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SOCIAL_LINKS } from '../../core/data/social-links';
import { SocialLink } from '../../core/models/social-link.model';

@Component({
  selector: 'app-about',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  readonly links: SocialLink[] = SOCIAL_LINKS.filter(l => !l.href.startsWith('mailto:'));
  readonly email = SOCIAL_LINKS.find(l => l.href.startsWith('mailto:'))!.href;
}
