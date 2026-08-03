import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { SbbSecondaryButton } from '@sbb-esta/lyne-angular/button';
import { SbbChipLabel } from '@sbb-esta/lyne-angular/chip-label';
import {
  SbbExpansionPanel,
  SbbExpansionPanelContent,
  SbbExpansionPanelHeader,
} from '@sbb-esta/lyne-angular/expansion-panel';
import { SbbFormField, SbbFormFieldClear } from '@sbb-esta/lyne-angular/form-field';
import { SbbMessage } from '@sbb-esta/lyne-angular/message';
import { SbbStatus } from '@sbb-esta/lyne-angular/status';
import { SbbTitle } from '@sbb-esta/lyne-angular/title';

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
  readonly searchText: string;
}

function normalizeSearchValue(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('de-CH')
    .trim();
}

function createSearchText(vulnerability: Vulnerability): string {
  const riskSignalText = vulnerability.riskSignals.flatMap((signal) => [
    signal.label,
    signal.explanation,
  ]);

  return normalizeSearchValue(
    [
      vulnerability.cveId,
      vulnerability.title,
      vulnerability.summary,
      vulnerability.owner?.team ?? '',
      ...riskSignalText,
    ].join(' '),
  );
}

function createVulnerabilityListItem(vulnerability: Vulnerability): VulnerabilityListItem {
  return {
    ...vulnerability,
    severityLabel: SEVERITY_LABELS[vulnerability.severity],
    severityStatusType: SEVERITY_STATUS_TYPES[vulnerability.severity],
    statusLabel: STATUS_LABELS[vulnerability.status],
    workflowStatusType: WORKFLOW_STATUS_TYPES[vulnerability.status],
    searchText: createSearchText(vulnerability),
  };
}

@Component({
  selector: 'app-triage-inbox',
  imports: [
    SbbChipLabel,
    SbbExpansionPanel,
    SbbExpansionPanelContent,
    SbbExpansionPanelHeader,
    SbbFormField,
    SbbFormFieldClear,
    SbbMessage,
    SbbSecondaryButton,
    SbbStatus,
    SbbTitle,
  ],
  templateUrl: './triage-inbox.html',
  styleUrl: './triage-inbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriageInbox {
  protected readonly vulnerabilities: readonly VulnerabilityListItem[] = VULNERABILITY_FIXTURES.map(
    createVulnerabilityListItem,
  );

  protected readonly searchQuery = signal('');

  protected readonly hasSearchQuery = computed(
    () => normalizeSearchValue(this.searchQuery()).length > 0,
  );

  protected readonly filteredVulnerabilities = computed(() => {
    const query = normalizeSearchValue(this.searchQuery());

    if (!query) {
      return this.vulnerabilities;
    }

    return this.vulnerabilities.filter((vulnerability) => vulnerability.searchText.includes(query));
  });

  protected updateSearchQuery(event: Event): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.searchQuery.set(target.value);
    }
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
  }
}
