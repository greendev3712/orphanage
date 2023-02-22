import { TestBed } from '@angular/core/testing';

import { PayPalServiceService } from './pay-pal-service.service';

describe('PayPalServiceService', () => {
  let service: PayPalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayPalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
