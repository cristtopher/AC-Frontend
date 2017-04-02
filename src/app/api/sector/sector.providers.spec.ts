/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SectorService } from './sector.providers';

describe('Providers: Register', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SectorService]
    });
  });

  it('should ...', inject([SectorService], (service: SectorService) => {
    expect(service).toBeTruthy();
  }));
});
