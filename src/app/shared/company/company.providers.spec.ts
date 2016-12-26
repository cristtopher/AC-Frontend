/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { COMPANY_PROVIDERS } from './company.providers';

describe('Providers: Company', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [COMPANY_PROVIDERS]
    });
  });

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
