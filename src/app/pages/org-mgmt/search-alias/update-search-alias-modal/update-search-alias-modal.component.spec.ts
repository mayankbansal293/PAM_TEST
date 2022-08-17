import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSearchAliasModalComponent } from './update-search-alias-modal.component';

describe('UpdateSearchAliasModalComponent', () => {
  let component: UpdateSearchAliasModalComponent;
  let fixture: ComponentFixture<UpdateSearchAliasModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSearchAliasModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSearchAliasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
