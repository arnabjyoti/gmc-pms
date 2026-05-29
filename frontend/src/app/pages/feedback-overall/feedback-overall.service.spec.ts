import { TestBed } from '@angular/core/testing';

import { FeedbackOverallService } from './feedback-overall.service';

describe('FeedbackOverallService', () => {
  let service: FeedbackOverallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackOverallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
