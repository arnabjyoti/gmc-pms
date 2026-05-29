import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalProgressComponent } from './physical-progress.component';

describe('PhysicalProgressComponent', () => {
  let component: PhysicalProgressComponent;
  let fixture: ComponentFixture<PhysicalProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
