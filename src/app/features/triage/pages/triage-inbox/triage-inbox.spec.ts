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

              <button
                class="clear-search"
                type="button"
                (click)="clearSearch()"
              >
                Suche zurücksetzen
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
                        signal of vulnerability.riskSignals;
                        track signal.id
                      ) {
                        <dl>
                          <dt>{{ signal.label }}</dt>
                          <dd>{{ signal.explanation }}</dd>
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

    const vulnerabilities = compiled.querySelectorAll('.vulnerability');

    expect(vulnerabilities).toHaveLength(1);
    expect(compiled.textContent).toContain(
      'Remote-Code-Ausführung im öffentlich erreichbaren Gateway',
    );
  });

  it('should show an empty state and reset the search', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const searchInput = compiled.querySelector<HTMLInputElement>('#search');
    const clearButton = compiled.querySelector<HTMLButtonElement>('.clear-search');

    expect(searchInput).not.toBeNull();
    expect(clearButton).not.toBeNull();

    searchInput!.value = 'nicht vorhandene schwachstelle';
    searchInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.vulnerability')).toHaveLength(0);
    expect(compiled.textContent).toContain('Keine Schwachstellen gefunden');

    clearButton!.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.vulnerability')).toHaveLength(3);
    expect(compiled.querySelector('.empty-state')).toBeNull();
  });
});
