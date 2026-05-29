import { TestBed } from '@angular/core/testing';

import { DocumentRepoService } from './document-repo.service';

describe('DocumentRepoService', () => {
  let service: DocumentRepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentRepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
