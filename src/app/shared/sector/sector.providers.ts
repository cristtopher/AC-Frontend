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

  get() {
    return this.authHttp.get(`${environment.API_BASEURL}/api/sectors`)
                        .map(res => {
                          let json = res.json();
                          console.log(`${JSON.stringify(json)}`);
                          return json.map(u => new Sector().fromJSON(u));
                        })
                        .catch(this.handleError);
  }
  
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  } 

}

//-------------------------------------------------------
//                      Resolvers
//-------------------------------------------------------

@Injectable()
export class SectorsResolve implements Resolve<Sector[]> {
  constructor(private sectorService: SectorService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.sectorService.get();
  }
}

//-------------------------------------------------------
//                      Providers
//-------------------------------------------------------

export const SECTOR_PROVIDERS: Provider[] = [
  { provide: SectorService, useClass: SectorService },
  { provide: SectorsResolve, useClass: SectorsResolve }
];