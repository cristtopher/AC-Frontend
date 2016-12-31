import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';

import { Observable, BehaviorSubject } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from '../auth/auth.service';

import { Sector } from './sector.model'
import { Register } from '../register/register.model'

//-------------------------------------------------------
//                      Services
//-------------------------------------------------------


@Injectable()
export class SectorService {  
  currentSector: BehaviorSubject<Sector> = new BehaviorSubject<Sector>(null);

  constructor(private authHttp: AuthHttp) { }

  get(query: Object = {}): Observable<Sector[]> {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    return this.authHttp.get(`${environment.API_BASEURL}/api/sectors${queryString ? '?' + queryString : ''}`)
                        .map(res => <Sector[]> res.json())
                        .do(sectors => {
                          if (!this.currentSector.getValue()) {
                            this.currentSector.next(sectors[0]);
                          }
                        })
                        .catch(this.handleError);
  }
  
  getRegisters(sector: Sector, query: Object = {}): Observable<Register[]> {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    return this.authHttp.get(`${environment.API_BASEURL}/api/sectors/${sector._id}/registers${queryString ? '?' + queryString : ''}`)
                        .map(res => <Register[]> res.json())
                        .catch(this.handleError);
    
  }
  
  setCurrentSector(sector: Sector) {
    this.currentSector.next(sector);
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