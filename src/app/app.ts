import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { SbbContainerModule } from '@sbb-esta/lyne-angular/container';
import { SbbHeaderModule } from '@sbb-esta/lyne-angular/header';
import { SbbSidebarModule } from '@sbb-esta/lyne-angular/sidebar';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    SbbContainerModule,
    SbbHeaderModule,
    SbbSidebarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}