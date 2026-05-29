import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostDisbursementComponent } from './cost-disbursement.component';

describe('CostDisbursementComponent', () => {
  let component: CostDisbursementComponent;
  let fixture: ComponentFixture<CostDisbursementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostDisbursementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
