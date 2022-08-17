import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPermissionsModalComponent } from './add-permissions-modal.component';

describe('AddPermissionsModalComponent', () => {
  let component: AddPermissionsModalComponent;
  let fixture: ComponentFixture<AddPermissionsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPermissionsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPermissionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
