/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { REGISTER_PROVIDERS } from './register.providers';

describe('Providers: Register', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [REGISTER_PROVIDERS]
    });
  });

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
