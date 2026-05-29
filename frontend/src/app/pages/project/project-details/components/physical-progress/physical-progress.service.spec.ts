import { TestBed } from '@angular/core/testing';

import { PhysicalProgressService } from './physical-progress.service';

describe('PhysicalProgressService', () => {
  let service: PhysicalProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysicalProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
