import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdateReportComponent } from './user-update-report.component';

describe('UserUpdateReportComponent', () => {
  let component: UserUpdateReportComponent;
  let fixture: ComponentFixture<UserUpdateReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUpdateReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUpdateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
