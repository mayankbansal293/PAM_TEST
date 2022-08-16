import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailChangeReportComponent } from './email-change-report.component';

describe('EmailChangeReportComponent', () => {
  let component: EmailChangeReportComponent;
  let fixture: ComponentFixture<EmailChangeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailChangeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailChangeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
