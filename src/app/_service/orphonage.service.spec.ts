import { TestBed } from '@angular/core/testing';

import { OrphonageService } from './orphonage.service';

describe('OrphonageService', () => {
  let service: OrphonageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrphonageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
