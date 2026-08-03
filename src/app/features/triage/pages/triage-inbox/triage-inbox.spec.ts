import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageInbox } from './triage-inbox';

describe('TriageInbox', () => {
  let component: TriageInbox;
  let fixture: ComponentFixture<TriageInbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriageInbox],
    }).compileComponents();

    fixture = TestBed.createComponent(TriageInbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
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

  it('should render Lyne status components for severity and workflow state', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const statuses = compiled.querySelectorAll('sbb-status');

    expect(statuses).toHaveLength(6);
    expect(statuses[0]?.getAttribute('type')).toBe('error');
    expect(statuses[1]?.getAttribute('type')).toBe('not-started');
  });
});
