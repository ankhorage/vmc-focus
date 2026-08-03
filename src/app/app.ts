import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SbbContainerModule } from '@sbb-esta/lyne-angular/container';
import { SbbHeaderModule } from '@sbb-esta/lyne-angular/header';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterOutlet,
    SbbContainerModule,
    SbbHeaderModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}