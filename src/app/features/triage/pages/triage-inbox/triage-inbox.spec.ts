import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageInbox } from './triage-inbox';

describe('TriageInbox', () => {
  let component: TriageInbox;
  let fixture: ComponentFixture<TriageInbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriageInbox],
    })
      .overrideComponent(TriageInbox, {
        set: {
          imports: [],
          template: `
            <main>
              <label for="search">Schwachstellen durchsuchen</label>

              <input
                id="search"
                [value]="searchQuery()"
                (input)="updateSearchQuery($event)"
              />

              <label for="status">Workflow-Status</label>

              <select
                id="status"
                [value]="selectedStatus()"
                (change)="updateStatusFilter($event)"
              >
                @for (option of statusOptions; track option.value) {
                  <option [value]="option.value">
                    {{ option.label }}
                  </option>
                }
              </select>

              <button
                class="clear-search"
                type="button"
                (click)="clearSearch()"
              >
                Suche leeren
              </button>

              <div class="severity-filters">
                @for (option of severityOptions; track option.value) {
                  <button
                    class="severity-filter"
                    type="button"
                    [attr.data-severity]="option.value"
                    [attr.data-amount]="option.amount"
                    [attr.aria-pressed]="
                      selectedSeverities().includes(option.value)
                    "
                    (click)="toggleSeverity(option.value)"
                  >
                    {{ option.label }}
                  </button>
                }
              </div>

              <button
                class="reset-filters"
                type="button"
                (click)="resetFilters()"
              >
                Alle Filter zurücksetzen
              </button>

              <p class="result-count">
                {{ filteredVulnerabilities().length }}
              </p>

              @for (
                vulnerability of filteredVulnerabilities();
                track vulnerability.id
              ) {
                <article
                  class="vulnerability"
                  [attr.data-severity-type]="
                    vulnerability.severityStatusType
                  "
                  [attr.data-workflow-type]="
                    vulnerability.workflowStatusType
                  "
                >
                  <h2>{{ vulnerability.title }}</h2>

                  <p class="severity">
                    {{ vulnerability.severityLabel }}
                  </p>

                  <p class="status">
                    {{ vulnerability.statusLabel }}
                  </p>

                  @if (vulnerability.riskSignals.length > 0) {
                    <section class="risk-signals">
                      <h3>Warum priorisiert?</h3>

                      <p class="risk-signal-count">
                        {{ vulnerability.riskSignals.length }}
                        {{
                          vulnerability.riskSignals.length === 1
                            ? 'Signal'
                            : 'Signale'
                        }}
                      </p>

                      @for (
                        riskSignal of vulnerability.riskSignals;
                        track riskSignal.id
                      ) {
                        <dl>
                          <dt>{{ riskSignal.label }}</dt>
                          <dd>{{ riskSignal.explanation }}</dd>
                        </dl>
                      }
                    </section>
                  }
                </article>
              }

              @if (filteredVulnerabilities().length === 0) {
                <p class="empty-state">
                  Keine Schwachstellen gefunden
                </p>
              }
            </main>
          `,
          styles: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TriageInbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display German severity and status labels', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const content = compiled.textContent ?? '';

    expect(content).toContain('Kritisch');
    expect(content).toContain('Hoch');
    expect(content).toContain('Mittel');
    expect(content).toContain('Niedrig');

    expect(content).toContain('Neu');
    expect(content).toContain('Zugewiesen');
    expect(content).toContain('In Prüfung');

    expect(content).not.toContain('critical');
    expect(content).not.toContain('assigned');
    expect(content).not.toContain('in-review');
  });

  it('should map domain values to semantic presentation states', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const vulnerabilities = compiled.querySelectorAll<HTMLElement>('.vulnerability');

    expect(vulnerabilities).toHaveLength(3);

    expect(vulnerabilities[0]?.dataset['severityType']).toBe('error');
    expect(vulnerabilities[0]?.dataset['workflowType']).toBe('not-started');

    expect(vulnerabilities[1]?.dataset['severityType']).toBe('warning');
    expect(vulnerabilities[1]?.dataset['workflowType']).toBe('pending');

    expect(vulnerabilities[2]?.dataset['severityType']).toBe('info');
    expect(vulnerabilities[2]?.dataset['workflowType']).toBe('in-progress');
  });

  it('should expose the number of vulnerabilities for each severity', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const criticalFilter = compiled.querySelector<HTMLElement>('[data-severity="critical"]');

    const lowFilter = compiled.querySelector<HTMLElement>('[data-severity="low"]');

    expect(criticalFilter?.dataset['amount']).toBe('1');
    expect(lowFilter?.dataset['amount']).toBe('0');
  });

  it('should explain the signals used for prioritization', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const disclosures = compiled.querySelectorAll('.risk-signals');
    const content = compiled.textContent ?? '';

    expect(disclosures).toHaveLength(2);

    expect(content).toContain('Warum priorisiert?');
    expect(content).toContain('5 Signale');
    expect(content).toContain('1 Signal');

    expect(content).toContain('Aktiv ausgenutzt');
    expect(content).toContain('Öffentlich erreichbar');
    expect(content).toContain('SLA gefährdet');

    expect(content).toContain('Die Schwachstelle wird nachweislich aktiv ausgenutzt.');
  });

  it('should filter vulnerabilities by title and risk signal', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const searchInput = compiled.querySelector<HTMLInputElement>('#search');

    expect(searchInput).not.toBeNull();

    searchInput!.value = 'offentlich';
    searchInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.vulnerability')).toHaveLength(1);

    expect(compiled.textContent).toContain(
      'Remote-Code-Ausführung im öffentlich erreichbaren Gateway',
    );
  });

  it('should filter vulnerabilities by multiple severities', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const criticalFilter = compiled.querySelector<HTMLButtonElement>('[data-severity="critical"]');

    const highFilter = compiled.querySelector<HTMLButtonElement>('[data-severity="high"]');

    expect(criticalFilter).not.toBeNull();
    expect(highFilter).not.toBeNull();

    criticalFilter!.click();
    highFilter!.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.vulnerability')).toHaveLength(2);

    expect(compiled.textContent).toContain(
      'Remote-Code-Ausführung im öffentlich erreichbaren Gateway',
    );

    expect(compiled.textContent).toContain('Rechteausweitung im Identitätsdienst');

    expect(compiled.textContent).not.toContain(
      'Offenlegung von Informationen in der Berichtskomponente',
    );
  });

  it('should filter vulnerabilities by workflow status', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const statusSelect = compiled.querySelector<HTMLSelectElement>('#status');

    expect(statusSelect).not.toBeNull();

    statusSelect!.value = 'assigned';
    statusSelect!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.vulnerability')).toHaveLength(1);

    expect(compiled.textContent).toContain('Rechteausweitung im Identitätsdienst');

    expect(compiled.textContent).not.toContain(
      'Remote-Code-Ausführung im öffentlich erreichbaren Gateway',
    );
  });

  it('should combine search, severity, and status filters', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const highFilter = compiled.querySelector<HTMLButtonElement>('[data-severity="high"]');

    const statusSelect = compiled.querySelector<HTMLSelectElement>('#status');

    const searchInput = compiled.querySelector<HTMLInputElement>('#search');

    expect(highFilter).not.toBeNull();
    expect(statusSelect).not.toBeNull();
    expect(searchInput).not.toBeNull();

    highFilter!.click();

    statusSelect!.value = 'assigned';
    statusSelect!.dispatchEvent(new Event('change'));

    searchInput!.value = 'identität';
    searchInput!.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(compiled.querySelectorAll('.vulnerability')).toHaveLength(1);

    expect(compiled.textContent).toContain('Rechteausweitung im Identitätsdienst');
  });

  it('should show an empty state for incompatible filters', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const criticalFilter = compiled.querySelector<HTMLButtonElement>('[data-severity="critical"]');

    const statusSelect = compiled.querySelector<HTMLSelectElement>('#status');

    expect(criticalFilter).not.toBeNull();
    expect(statusSelect).not.toBeNull();

    criticalFilter!.click();

    statusSelect!.value = 'assigned';
    statusSelect!.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    expect(compiled.querySelectorAll('.vulnerability')).toHaveLength(0);

    expect(compiled.textContent).toContain('Keine Schwachstellen gefunden');
  });

  it('should reset all filters together', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const criticalFilter = compiled.querySelector<HTMLButtonElement>('[data-severity="critical"]');

    const statusSelect = compiled.querySelector<HTMLSelectElement>('#status');

    const searchInput = compiled.querySelector<HTMLInputElement>('#search');

    const resetButton = compiled.querySelector<HTMLButtonElement>('.reset-filters');

    expect(criticalFilter).not.toBeNull();
    expect(statusSelect).not.toBeNull();
    expect(searchInput).not.toBeNull();
    expect(resetButton).not.toBeNull();

    criticalFilter!.click();

    statusSelect!.value = 'assigned';
    statusSelect!.dispatchEvent(new Event('change'));

    searchInput!.value = 'nicht vorhandene schwachstelle';
    searchInput!.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(compiled.querySelectorAll('.vulnerability')).toHaveLength(0);

    resetButton!.click();
    fixture.detectChanges();

    expect(searchInput!.value).toBe('');
    expect(statusSelect!.value).toBe('all');
    expect(criticalFilter!.getAttribute('aria-pressed')).toBe('false');

    expect(compiled.querySelectorAll('.vulnerability')).toHaveLength(3);

    expect(compiled.querySelector('.empty-state')).toBeNull();
  });
});
