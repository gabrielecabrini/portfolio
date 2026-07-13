import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BLOG_POSTS } from '../../../core/data/blog.registry';

@Component({
  selector: 'app-blog-list',
  imports: [TranslatePipe],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogList {
  readonly posts = BLOG_POSTS;
}
