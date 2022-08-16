import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryStateCityFormComponent } from './country-state-city-form.component';

describe('CountryStateCityFormComponent', () => {
  let component: CountryStateCityFormComponent;
  let fixture: ComponentFixture<CountryStateCityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryStateCityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryStateCityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
