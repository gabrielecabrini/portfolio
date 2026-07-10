import { ChangeDetectionStrategy, Component } from '@angular/core';
import packageJson from '../../../../../package.json';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly year = new Date().getFullYear();
  readonly version: string = packageJson.version;
}
