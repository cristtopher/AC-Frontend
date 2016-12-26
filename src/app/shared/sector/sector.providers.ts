import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from '../auth/auth.service';

import { Sector } from './sector.model'

//-------------------------------------------------------
//                      Services
//-------------------------------------------------------


@Injectable()
export class SectorService {

  constructor(private authHttp: AuthHttp) { }
  
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  } 

}

//-------------------------------------------------------
//                      Resolvers
//-------------------------------------------------------



//-------------------------------------------------------
//                      Providers
//-------------------------------------------------------

export const SECTOR_PROVIDERS: Provider[] = [
  { provide: SectorService, useClass: SectorService }
];