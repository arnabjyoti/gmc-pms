import { TestBed } from '@angular/core/testing';

import { PublicLoginService } from './public-login.service';

describe('PublicLoginService', () => {
  let service: PublicLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
