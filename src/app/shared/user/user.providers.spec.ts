/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { USER_PROVIDERS } from './user.providers';

describe('Providers: User', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [USER_PROVIDERS]
    });
  });

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
