import { TestBed } from '@angular/core/testing';

import { CurrencyDetailsService } from './currency-details.service';

describe('CurrencyDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrencyDetailsService = TestBed.get(CurrencyDetailsService);
    expect(service).toBeTruthy();
  });
});
