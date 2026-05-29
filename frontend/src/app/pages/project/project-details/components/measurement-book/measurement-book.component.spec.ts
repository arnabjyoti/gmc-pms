import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementBookComponent } from './measurement-book.component';

describe('MeasurementBookComponent', () => {
  let component: MeasurementBookComponent;
  let fixture: ComponentFixture<MeasurementBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurementBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
