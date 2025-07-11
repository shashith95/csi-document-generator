import { TestBed } from '@angular/core/testing';

import { CustomPrinterService } from './custom-printer.service';

describe('CustomPrinterService', () => {
  let service: CustomPrinterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomPrinterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
