import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RsaIdChangeReportComponent } from './rsa-id-change-report.component';

describe('RsaIdChangeReportComponent', () => {
  let component: RsaIdChangeReportComponent;
  let fixture: ComponentFixture<RsaIdChangeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RsaIdChangeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RsaIdChangeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
