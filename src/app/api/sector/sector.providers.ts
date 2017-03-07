import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
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
  
  constructor(private authHttp: AuthHttp) { }
  
  getRegisters(sector: Sector, query: Object = {}): Observable<any> {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    return this.authHttp.get(`${environment.API_BASEURL}/api/sectors/${sector._id}/registers${queryString ? '?' + queryString : ''}`)
                        .map(res => {
                          
                          console.log(`got response from registers: pages: ${JSON.stringify(res.headers.get('X-Pagination-Page'))}`);
                          
                          return {
                            page: parseInt(res.headers.get('X-Pagination-Page')),
                            pages: parseInt(res.headers.get('X-Pagination-Pages')),
                            data: <Register[]> res.json()                            
                          }
                        })
                        .catch(this.handleError);
    
  }
    
  getStatistics(sector: Sector): Observable<any> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/sectors/${sector._id}/statistics`)
                        .map(res => res.json())
                        .catch(this.handleError);
  }
    
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  } 

  exportExcel(sector: Sector): Observable<any> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/sectors/${sector._id}/export`, { responseType: ResponseContentType.Blob })
                        .map(res => res.blob())
                        .catch(this.handleError)
  }

}


//-------------------------------------------------------
//                      Providers
//-------------------------------------------------------

export const SECTOR_PROVIDERS: Provider[] = [
  { provide: SectorService, useClass: SectorService }
];