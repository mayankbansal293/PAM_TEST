import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHeadRolesComponent } from './manage-head-roles.component';

describe('ManageHeadRolesComponent', () => {
  let component: ManageHeadRolesComponent;
  let fixture: ComponentFixture<ManageHeadRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageHeadRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHeadRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
