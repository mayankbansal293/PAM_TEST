import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaCardComponent } from './ba-card.component';

describe('BaCardComponent', () => {
  let component: BaCardComponent;
  let fixture: ComponentFixture<BaCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
