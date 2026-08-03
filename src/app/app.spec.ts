import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    })
      .overrideComponent(App, {
        set: {
          imports: [RouterOutlet],
          template: '<router-outlet />',
        },
      })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should provide the application router outlet', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});