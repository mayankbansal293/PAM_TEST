import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegeReportComponent } from './privilege-report.component';

describe('PrivilegeReportComponent', () => {
  let component: PrivilegeReportComponent;
  let fixture: ComponentFixture<PrivilegeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivilegeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
