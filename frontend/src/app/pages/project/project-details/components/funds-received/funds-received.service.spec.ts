import { TestBed } from '@angular/core/testing';

import { FundsReceivedService } from './funds-received.service';

describe('FundsReceivedService', () => {
  let service: FundsReceivedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundsReceivedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
