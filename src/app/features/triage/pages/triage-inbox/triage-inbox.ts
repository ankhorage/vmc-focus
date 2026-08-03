import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { SbbSecondaryButton, SbbTransparentButton } from '@sbb-esta/lyne-angular/button';
import { SbbCard } from '@sbb-esta/lyne-angular/card';
import { SbbChipLabel } from '@sbb-esta/lyne-angular/chip-label';
import {
  SbbExpansionPanel,
  SbbExpansionPanelContent,
  SbbExpansionPanelHeader,
} from '@sbb-esta/lyne-angular/expansion-panel';
import { SbbFormField, SbbFormFieldClear } from '@sbb-esta/lyne-angular/form-field';
import { SbbMessage } from '@sbb-esta/lyne-angular/message';
import { SbbOption } from '@sbb-esta/lyne-angular/option';
import { SbbSelect } from '@sbb-esta/lyne-angular/select';
import { SbbStatus } from '@sbb-esta/lyne-angular/status';
import { SbbTag, SbbTagGroup } from '@sbb-esta/lyne-angular/tag';
import { SbbTitle } from '@sbb-esta/lyne-angular/title';

import { VULNERABILITY_FIXTURES } from '../../domain/vulnerability.fixtures';
import type { Vulnerability } from '../../domain/vulnerability.model';

type Severity = Vulnerability['severity'];
type WorkflowStatus = Vulnerability['status'];
type StatusFilter = WorkflowStatus | 'all';

type SortOrder = 'priority' | 'cvss-desc' | 'cvss-asc' | 'epss-desc' | 'due-asc';

type StatusType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'pending'
  | 'incomplete'
  | 'not-started'
  | 'in-progress';

interface SeverityFilterOption {
  readonly value: Severity;
  readonly label: string;
  readonly amount: string;
}

interface StatusFilterOption {
  readonly value: StatusFilter;
  readonly label: string;
}

interface SortOption {
  readonly value: SortOrder;
  readonly label: string;
}

interface VulnerabilityListItem extends Vulnerability {
  readonly severityLabel: string;
  readonly severityStatusType: StatusType;
  readonly statusLabel: string;
  readonly workflowStatusType: StatusType;
  readonly searchText: string;
}

const SEVERITY_VALUES: readonly Severity[] = ['critical', 'high', 'medium', 'low'];

const STATUS_VALUES: readonly WorkflowStatus[] = [
  'new',
  'in-review',
  'assigned',
  'in-remediation',
  'resolved',
  'accepted',
];

const SORT_ORDER_VALUES: readonly SortOrder[] = [
  'priority',
  'cvss-desc',
  'cvss-asc',
  'epss-desc',
  'due-asc',
];

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: 'Kritisch',
  high: 'Hoch',
  medium: 'Mittel',
  low: 'Niedrig',
};

const SEVERITY_STATUS_TYPES: Record<Severity, StatusType> = {
  critical: 'error',
  high: 'warning',
  medium: 'info',
  low: 'info',
};

const STATUS_LABELS: Record<WorkflowStatus, string> = {
  new: 'Neu',
  'in-review': 'In Prüfung',
  assigned: 'Zugewiesen',
  'in-remediation': 'In Behebung',
  resolved: 'Behoben',
  accepted: 'Risiko akzeptiert',
};

const WORKFLOW_STATUS_TYPES: Record<WorkflowStatus, StatusType> = {
  new: 'not-started',
  'in-review': 'in-progress',
  assigned: 'pending',
  'in-remediation': 'in-progress',
  resolved: 'success',
  accepted: 'info',
};

const SEVERITY_PRIORITY: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const URGENCY_PRIORITY: Record<Vulnerability['urgency'], number> = {
  immediate: 4,
  urgent: 3,
  planned: 2,
  monitor: 1,
};

const SEVERITY_FILTER_OPTIONS: readonly SeverityFilterOption[] = SEVERITY_VALUES.map((value) => ({
  value,
  label: SEVERITY_LABELS[value],
  amount: String(
    VULNERABILITY_FIXTURES.filter((vulnerability) => vulnerability.severity === value).length,
  ),
}));

const STATUS_FILTER_OPTIONS: readonly StatusFilterOption[] = [
  {
    value: 'all',
    label: 'Alle',
  },
  ...STATUS_VALUES.map((value) => ({
    value,
    label: STATUS_LABELS[value],
  })),
];

const SORT_OPTIONS: readonly SortOption[] = [
  {
    value: 'priority',
    label: 'Priorität',
  },
  {
    value: 'cvss-desc',
    label: 'CVSS – höchste zuerst',
  },
  {
    value: 'cvss-asc',
    label: 'CVSS – niedrigste zuerst',
  },
  {
    value: 'epss-desc',
    label: 'EPSS – höchste zuerst',
  },
  {
    value: 'due-asc',
    label: 'Frist – nächste zuerst',
  },
];

function normalizeSearchValue(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('de-CH')
    .trim();
}

function createSearchText(vulnerability: Vulnerability): string {
  const riskSignalText = vulnerability.riskSignals.flatMap((riskSignal) => [
    riskSignal.label,
    riskSignal.explanation,
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

function getControlValue(event: Event): string | null {
  const target = event.target as { value?: unknown } | null;
  const value = target?.value;

  return typeof value === 'string' ? value : null;
}

function isStatusFilter(value: string): value is StatusFilter {
  return value === 'all' || STATUS_VALUES.some((workflowStatus) => workflowStatus === value);
}

function isSortOrder(value: string): value is SortOrder {
  return SORT_ORDER_VALUES.some((sortOrder) => sortOrder === value);
}

function comparePriority(first: VulnerabilityListItem, second: VulnerabilityListItem): number {
  const urgencyDifference = URGENCY_PRIORITY[second.urgency] - URGENCY_PRIORITY[first.urgency];

  if (urgencyDifference !== 0) {
    return urgencyDifference;
  }

  const knownExploitedDifference = Number(second.knownExploited) - Number(first.knownExploited);

  if (knownExploitedDifference !== 0) {
    return knownExploitedDifference;
  }

  const severityDifference = SEVERITY_PRIORITY[second.severity] - SEVERITY_PRIORITY[first.severity];

  if (severityDifference !== 0) {
    return severityDifference;
  }

  const epssDifference = second.epssProbability - first.epssProbability;

  if (epssDifference !== 0) {
    return epssDifference;
  }

  const deadlineDifference =
    Date.parse(first.remediationDueAt) - Date.parse(second.remediationDueAt);

  if (deadlineDifference !== 0) {
    return deadlineDifference;
  }

  return first.cveId.localeCompare(second.cveId);
}

function sortVulnerabilities(
  vulnerabilities: readonly VulnerabilityListItem[],
  sortOrder: SortOrder,
): readonly VulnerabilityListItem[] {
  const sortedVulnerabilities = [...vulnerabilities];

  sortedVulnerabilities.sort((first, second) => {
    switch (sortOrder) {
      case 'cvss-desc':
        return second.cvssScore - first.cvssScore || comparePriority(first, second);

      case 'cvss-asc':
        return first.cvssScore - second.cvssScore || comparePriority(first, second);

      case 'epss-desc':
        return second.epssProbability - first.epssProbability || comparePriority(first, second);

      case 'due-asc':
        return (
          Date.parse(first.remediationDueAt) - Date.parse(second.remediationDueAt) ||
          comparePriority(first, second)
        );

      case 'priority':
        return comparePriority(first, second);
    }
  });

  return sortedVulnerabilities;
}

@Component({
  selector: 'app-triage-inbox',
  imports: [
    SbbCard,
    SbbChipLabel,
    SbbExpansionPanel,
    SbbExpansionPanelContent,
    SbbExpansionPanelHeader,
    SbbFormField,
    SbbFormFieldClear,
    SbbMessage,
    SbbOption,
    SbbSecondaryButton,
    SbbSelect,
    SbbStatus,
    SbbTag,
    SbbTagGroup,
    SbbTitle,
    SbbTransparentButton,
  ],
  templateUrl: './triage-inbox.html',
  styleUrl: './triage-inbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriageInbox {
  protected readonly vulnerabilities: readonly VulnerabilityListItem[] = VULNERABILITY_FIXTURES.map(
    createVulnerabilityListItem,
  );

  protected readonly severityOptions = SEVERITY_FILTER_OPTIONS;

  protected readonly statusOptions = STATUS_FILTER_OPTIONS;

  protected readonly sortOptions = SORT_OPTIONS;

  protected readonly searchQuery = signal('');

  protected readonly selectedSeverities = signal<readonly Severity[]>([]);

  protected readonly selectedStatus = signal<StatusFilter>('all');

  protected readonly selectedSort = signal<SortOrder>('priority');

  protected readonly hasSearchQuery = computed(
    () => normalizeSearchValue(this.searchQuery()).length > 0,
  );

  protected readonly hasActiveFilters = computed(
    () =>
      this.hasSearchQuery() ||
      this.selectedSeverities().length > 0 ||
      this.selectedStatus() !== 'all',
  );

  protected readonly filteredVulnerabilities = computed(() => {
    const query = normalizeSearchValue(this.searchQuery());
    const selectedSeverities = this.selectedSeverities();
    const selectedStatus = this.selectedStatus();

    return this.vulnerabilities.filter((vulnerability) => {
      const matchesSearch = !query || vulnerability.searchText.includes(query);

      const matchesSeverity =
        selectedSeverities.length === 0 || selectedSeverities.includes(vulnerability.severity);

      const matchesStatus = selectedStatus === 'all' || vulnerability.status === selectedStatus;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  });

  protected readonly visibleVulnerabilities = computed(() =>
    sortVulnerabilities(this.filteredVulnerabilities(), this.selectedSort()),
  );

  protected updateSearchQuery(event: Event): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.searchQuery.set(target.value);
    }
  }

  protected updateStatusFilter(event: Event): void {
    const value = getControlValue(event);

    if (value && isStatusFilter(value)) {
      this.selectedStatus.set(value);
    }
  }

  protected updateSortOrder(event: Event): void {
    const value = getControlValue(event);

    if (value && isSortOrder(value)) {
      this.selectedSort.set(value);
    }
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
  }

  protected toggleSeverity(severity: Severity): void {
    this.selectedSeverities.update((selectedSeverities) =>
      selectedSeverities.includes(severity)
        ? selectedSeverities.filter((selectedSeverity) => selectedSeverity !== severity)
        : [...selectedSeverities, severity],
    );
  }

  protected resetFilters(): void {
    this.searchQuery.set('');
    this.selectedSeverities.set([]);
    this.selectedStatus.set('all');
  }
}
