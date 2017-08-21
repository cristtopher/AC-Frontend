import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';

import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';

import { Sector } from './sector.model'
import { Register } from '../register/register.model'

import * as moment from 'moment';
import * as _      from 'lodash';

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
                          if (!query['paging']) { return <Register[]> res.json(); }
                          
                          return {
                            page: parseInt(res.headers.get('X-Pagination-Page')),
                            pages: parseInt(res.headers.get('X-Pagination-Pages')),
                            data: <Register[]> res.json()                            
                          }
                        })
                        .catch(this.handleError);
    
  }
  
  createRegister(sector: Sector, register: Register): Observable<Register> {
    return this.authHttp.post(`${environment.API_BASEURL}/api/sectors/${sector._id}/registers`, {
      person: register.person._id,
      time: register.time,
      type: register.type,
      comments: register.comments
    })
    .map(res => <Register> res.json())
    .catch(this.handleError);
  }
  

  
  getStatistics(sector: Sector): Observable<any> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/sectors/${sector._id}/statistics`)
                        .map(res => res.json())
                        .map(statisticsData => {
                          const now: Date = new Date();
                          const weeklyRegisters: Register[] = statisticsData.weeklyRegisters;
                                                    
                          statisticsData.weeklyHistory = {
                            entry: [],
                            depart: []
                          };
            
                          for(let i = 0; i <= 6; i++) {
                            let upperDate = i == 0 ? now : moment(now).startOf('day').subtract(i - 1, 'days');
                            let lowerDate = i == 0 ? moment(now).startOf('day') : moment(now).startOf('day').subtract(i, 'days');

                            let timeFilteredRegisters = _.filter(weeklyRegisters, r => moment(r.time) < upperDate && moment(r.time) > lowerDate);

                            let entriesFound = _.filter(timeFilteredRegisters, r => r.type === 'entry');
                            let departsFound = _.filter(timeFilteredRegisters, r => r.type === 'depart');

                            statisticsData.weeklyHistory.entry.push({ 
                              datetime: lowerDate.unix() * 1000, 
                              count: _.size(entriesFound) 
                            });
                            
                            statisticsData.weeklyHistory.depart.push({ 
                              datetime: lowerDate.unix() * 1000, 
                              count: _.size(departsFound) 
                            });
                          }
                          
                          return statisticsData;
                        })
                        .catch(this.handleError);
  }

  getStatisticsDetails(sector: Sector, query: Object = {}): Observable<any[]> {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    return this.authHttp.get(`${environment.API_BASEURL}/api/sectors/${sector._id}/statisticsDetails${queryString ? '?' + queryString : ''}`)
                        .map(res => {                          
                          return {
                            page: parseInt(res.headers.get('X-Pagination-Page')),
                            pages: parseInt(res.headers.get('X-Pagination-Pages')),
                            data: <Register[]> res.json()                       
                          }
                        })
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