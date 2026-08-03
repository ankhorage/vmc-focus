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
});
