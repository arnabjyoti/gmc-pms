import { TestBed } from '@angular/core/testing';

import { CostDisbursementService } from './cost-disbursement.service';

describe('CostDisbursementService', () => {
  let service: CostDisbursementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostDisbursementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
