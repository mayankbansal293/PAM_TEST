import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelRegComponent } from './channel-reg.component';

describe('ChannelRegComponent', () => {
  let component: ChannelRegComponent;
  let fixture: ComponentFixture<ChannelRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChannelRegComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
