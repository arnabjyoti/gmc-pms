import { TestBed } from '@angular/core/testing';

import { DohuaGeotagService } from './dohua-geotag.service';

describe('DohuaGeotagService', () => {
  let service: DohuaGeotagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DohuaGeotagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
