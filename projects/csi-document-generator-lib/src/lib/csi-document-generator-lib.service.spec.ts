import { TestBed } from '@angular/core/testing';

import { CsiDocumentGeneratorLibService } from './csi-document-generator-lib.service';

describe('CsiDocumentGeneratorLibService', () => {
  let service: CsiDocumentGeneratorLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsiDocumentGeneratorLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
