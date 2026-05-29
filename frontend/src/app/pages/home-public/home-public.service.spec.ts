import { TestBed } from '@angular/core/testing';

import { HomePublicService } from './home-public.service';

describe('HomePublicService', () => {
  let service: HomePublicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomePublicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
