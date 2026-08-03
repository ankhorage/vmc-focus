import { ChangeDetectionStrategy, Component } from '@angular/core';

import { VULNERABILITY_FIXTURES } from '../../domain/vulnerability.fixtures';
import type { Vulnerability } from '../../domain/vulnerability.model';

const SEVERITY_LABELS: Record<Vulnerability['severity'], string> = {
  critical: 'Kritisch',
  high: 'Hoch',
  medium: 'Mittel',
  low: 'Niedrig',
};

const STATUS_LABELS: Record<Vulnerability['status'], string> = {
  new: 'Neu',
  'in-review': 'In Prüfung',
  assigned: 'Zugewiesen',
  'in-remediation': 'In Behebung',
  resolved: 'Behoben',
  accepted: 'Risiko akzeptiert',
};

interface VulnerabilityListItem extends Vulnerability {
  readonly severityLabel: string;
  readonly statusLabel: string;
}

function createVulnerabilityListItem(vulnerability: Vulnerability): VulnerabilityListItem {
  return {
    ...vulnerability,
    severityLabel: SEVERITY_LABELS[vulnerability.severity],
    statusLabel: STATUS_LABELS[vulnerability.status],
  };
}

@Component({
  selector: 'app-triage-inbox',
  imports: [],
  templateUrl: './triage-inbox.html',
  styleUrl: './triage-inbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriageInbox {
  protected readonly vulnerabilities: readonly VulnerabilityListItem[] = VULNERABILITY_FIXTURES.map(
    createVulnerabilityListItem,
  );
}
