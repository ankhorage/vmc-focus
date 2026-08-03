import { Component } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/lyne-angular/button';

@Component({
  selector: 'app-root',
  imports: [SbbButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}