import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'triage',
  },
  {
    path: 'triage',
    title: 'Triage Inbox | VMC Focus',
    loadComponent: () =>
      import('./features/triage/pages/triage-inbox/triage-inbox').then(
        (module) => module.TriageInbox,
      ),
  },
  {
    path: '**',
    redirectTo: 'triage',
  },
];