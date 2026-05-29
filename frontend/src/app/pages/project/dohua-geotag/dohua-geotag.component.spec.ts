import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DohuaGeotagComponent } from './dohua-geotag.component';

describe('DohuaGeotagComponent', () => {
  let component: DohuaGeotagComponent;
  let fixture: ComponentFixture<DohuaGeotagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DohuaGeotagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DohuaGeotagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
