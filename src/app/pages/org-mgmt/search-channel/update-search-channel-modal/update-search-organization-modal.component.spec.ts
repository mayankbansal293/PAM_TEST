import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSearchChannelModalComponent } from './update-search-channel-modal.component';

describe('UpdateSearchChannelModalComponent', () => {
  let component: UpdateSearchChannelModalComponent;
  let fixture: ComponentFixture<UpdateSearchChannelModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSearchChannelModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSearchChannelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
