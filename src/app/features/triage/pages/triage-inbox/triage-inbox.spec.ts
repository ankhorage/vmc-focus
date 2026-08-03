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
              @for (vulnerability of vulnerabilities; track vulnerability.id) {
                <article
                  class="vulnerability"
                  [attr.data-severity-type]="vulnerability.severityStatusType"
                  [attr.data-workflow-type]="vulnerability.workflowStatusType"
                >
                  <h2>{{ vulnerability.title }}</h2>

                  <p class="severity">{{ vulnerability.severityLabel }}</p>
                  <p class="status">{{ vulnerability.statusLabel }}</p>

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
});
