import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { SbbContainerModule } from '@sbb-esta/lyne-angular/container';
import { SbbHeaderModule } from '@sbb-esta/lyne-angular/header';
import {
  SbbSidebar,
  SbbSidebarContainer,
  SbbSidebarContent,
  SbbSidebarTitle,
} from '@sbb-esta/lyne-angular/sidebar';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    SbbContainerModule,
    SbbHeaderModule,
    SbbSidebar,
    SbbSidebarContainer,
    SbbSidebarContent,
    SbbSidebarTitle,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly destroyRef = inject(DestroyRef);

  private readonly mobileMediaQuery =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(width < 48rem)')
      : null;

  protected readonly isMobile = signal(this.mobileMediaQuery?.matches ?? false);

  protected readonly mobileNavigationOpen = signal(false);

  protected readonly sidebarMode = computed<'side' | 'over'>(() =>
    this.isMobile() ? 'over' : 'side',
  );

  protected readonly sidebarOpened = computed(
    () => !this.isMobile() || this.mobileNavigationOpen(),
  );

  constructor() {
    const mobileMediaQuery = this.mobileMediaQuery;

    if (!mobileMediaQuery) {
      return;
    }

    const updateMobileState = (event: MediaQueryListEvent): void => {
      this.isMobile.set(event.matches);

      if (!event.matches) {
        this.mobileNavigationOpen.set(false);
      }
    };

    mobileMediaQuery.addEventListener('change', updateMobileState);

    this.destroyRef.onDestroy(() => {
      mobileMediaQuery.removeEventListener('change', updateMobileState);
    });
  }

  protected openMobileNavigation(): void {
    this.mobileNavigationOpen.set(true);
  }

  protected closeMobileNavigation(): void {
    this.mobileNavigationOpen.set(false);
  }
}
