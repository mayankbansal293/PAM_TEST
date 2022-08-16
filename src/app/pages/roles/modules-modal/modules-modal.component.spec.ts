import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesModalComponent } from './modules-modal.component';

describe('ModulesModalComponent', () => {
  let component: ModulesModalComponent;
  let fixture: ComponentFixture<ModulesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
