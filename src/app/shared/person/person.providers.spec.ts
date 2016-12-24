/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PERSON_PROVIDERS } from './person.providers';

describe('Providers: Person', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PERSON_PROVIDERS]
    });
  });

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
