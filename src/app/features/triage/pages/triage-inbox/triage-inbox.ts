import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SbbStatus } from '@sbb-esta/lyne-angular/status';

import { VULNERABILITY_FIXTURES } from '../../domain/vulnerability.fixtures';
import type { Vulnerability } from '../../domain/vulnerability.model';

type StatusType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'pending'
  | 'incomplete'
  | 'not-started'
  | 'in-progress';

const SEVERITY_LABELS: Record<Vulnerability['severity'], string> = {
  critical: 'Kritisch',
  high: 'Hoch',
  medium: 'Mittel',
  low: 'Niedrig',
};

const SEVERITY_STATUS_TYPES: Record<Vulnerability['severity'], StatusType> = {
  critical: 'error',
  high: 'warning',
  medium: 'info',
  low: 'info',
};

const STATUS_LABELS: Record<Vulnerability['status'], string> = {
  new: 'Neu',
  'in-review': 'In Prüfung',
  assigned: 'Zugewiesen',
  'in-remediation': 'In Behebung',
  resolved: 'Behoben',
  accepted: 'Risiko akzeptiert',
};

const WORKFLOW_STATUS_TYPES: Record<Vulnerability['status'], StatusType> = {
  new: 'not-started',
  'in-review': 'in-progress',
  assigned: 'pending',
  'in-remediation': 'in-progress',
  resolved: 'success',
  accepted: 'info',
};

interface VulnerabilityListItem extends Vulnerability {
  readonly severityLabel: string;
  readonly severityStatusType: StatusType;
  readonly statusLabel: string;
  readonly workflowStatusType: StatusType;
}

function createVulnerabilityListItem(vulnerability: Vulnerability): VulnerabilityListItem {
  return {
    ...vulnerability,
    severityLabel: SEVERITY_LABELS[vulnerability.severity],
    severityStatusType: SEVERITY_STATUS_TYPES[vulnerability.severity],
    statusLabel: STATUS_LABELS[vulnerability.status],
    workflowStatusType: WORKFLOW_STATUS_TYPES[vulnerability.status],
  };
}

@Component({
  selector: 'app-triage-inbox',
  imports: [SbbStatus],
  templateUrl: './triage-inbox.html',
  styleUrl: './triage-inbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriageInbox {
  protected readonly vulnerabilities: readonly VulnerabilityListItem[] = VULNERABILITY_FIXTURES.map(
    createVulnerabilityListItem,
  );
}
