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
});
