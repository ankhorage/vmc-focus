import { ChangeDetectionStrategy, Component } from '@angular/core';

import { VULNERABILITY_FIXTURES } from '../../domain/vulnerability.fixtures';

@Component({
  selector: 'app-triage-inbox',
  imports: [],
  templateUrl: './triage-inbox.html',
  styleUrl: './triage-inbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriageInbox {
  protected readonly vulnerabilities = VULNERABILITY_FIXTURES;
}
