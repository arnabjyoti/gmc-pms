import { TestBed } from '@angular/core/testing';

import { MeasurementBookService } from './measurement-book.service';

describe('MeasurementBookService', () => {
  let service: MeasurementBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasurementBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
