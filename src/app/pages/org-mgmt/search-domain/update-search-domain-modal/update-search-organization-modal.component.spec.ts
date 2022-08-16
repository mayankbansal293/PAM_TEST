import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSearchDomainModalComponent } from './update-search-domain-modal.component';

describe('UpdateSearchDomainModalComponent', () => {
  let component: UpdateSearchDomainModalComponent;
  let fixture: ComponentFixture<UpdateSearchDomainModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateSearchDomainModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSearchDomainModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
