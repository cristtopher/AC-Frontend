import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { FileUploader } from 'ng2-file-upload';

import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';

import { Company } from './company.model'
import { Person } from '../person/person.model';
import { Register } from '../register/register.model';

import * as moment from 'moment';
import * as _      from 'lodash';


//-------------------------------------------------------
//                      Services
//-------------------------------------------------------


@Injectable()
export class CompanyService {  
  constructor(private authHttp: AuthHttp, private authService: AuthService) { }
  
  get(query: Object = {}) {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    return this.authHttp.get(`${environment.API_BASEURL}/api/companies${queryString ? '?' + queryString : ''}`)
                        .map(res => <Company[]> res.json())
                        .catch(this.handleError);
  }
  
  getPersons(company: Company, query: Object = {}): Observable<any> {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    return this.authHttp.get(`${environment.API_BASEURL}/api/companies/${company._id}/persons${queryString ? '?' + queryString : ''}`)
                        .map(res => {
                          if (!query['paging']) { return <Person[]> res.json(); }
                          
                          return {
                            page: parseInt(res.headers.get('X-Pagination-Page')),
                            pages: parseInt(res.headers.get('X-Pagination-Pages')),
                            data: <Person[]> res.json()                            
                          } 
                        })
                        .catch(this.handleError);
  }

  getStatistics(company: Company): Observable<any> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/companies/${company._id}/statistics`)
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
  
  getRegisters(company: Company, query: Object = {}): Observable<any> {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    return this.authHttp.get(`${environment.API_BASEURL}/api/companies/${company._id}/registers${queryString ? '?' + queryString : ''}`)
                        .map(res => <Person[]> res.json())
                        .catch(this.handleError)
  }
  
  exportExcel(company: Company): Observable<any> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/companies/${company._id}/persons/export`, { responseType: ResponseContentType.Blob })
                        .map(res => res.blob())
                        .catch(this.handleError)
  }

  getExcelUploader(company: Company): FileUploader {
    let uploader = new FileUploader({ 
      url: `${environment.API_BASEURL}/api/companies/${company._id}/persons/import`, 
      authToken: `Bearer ${this.authService.getAccessToken()}`
    });
    
    uploader.onBeforeUploadItem = item => {
      item._xhr.responseType = 'blob';
    }    
    
    return uploader;
  }
  
  
  createPerson(company: Company, person: Person): Observable<any> {
    return this.authHttp.post(`${environment.API_BASEURL}/api/companies/${company._id}/persons`, person)
                        .map(res => <Person> res.json())
                        .catch(this.handleError);
  }
  
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json() || 'Server error');
  } 

}

//-------------------------------------------------------
//                      Resolvers
//-------------------------------------------------------



//-------------------------------------------------------
//                      Providers
//-------------------------------------------------------

export const COMPANY_PROVIDERS: Provider[] = [
  { provide: CompanyService, useClass: CompanyService }
];