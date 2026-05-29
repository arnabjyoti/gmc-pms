import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsReceivedComponent } from './funds-received.component';

describe('FundsReceivedComponent', () => {
  let component: FundsReceivedComponent;
  let fixture: ComponentFixture<FundsReceivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundsReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
