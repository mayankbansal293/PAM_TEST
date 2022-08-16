import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMenuPrivilegesComponent } from './user-menu-privileges.component';

describe('UserMenuPrivilegesComponent', () => {
  let component: UserMenuPrivilegesComponent;
  let fixture: ComponentFixture<UserMenuPrivilegesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMenuPrivilegesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuPrivilegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
