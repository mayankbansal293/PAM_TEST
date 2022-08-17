import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAliasComponent } from './search-alias.component';

describe('SearchAliasComponent', () => {
  let component: SearchAliasComponent;
  let fixture: ComponentFixture<SearchAliasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchAliasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
