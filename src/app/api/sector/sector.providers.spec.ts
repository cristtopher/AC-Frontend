/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SECTOR_PROVIDERS } from './sector.providers';

describe('Providers: Register', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SECTOR_PROVIDERS]
    });
  });

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
