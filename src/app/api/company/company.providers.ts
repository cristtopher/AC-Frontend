import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { FileUploader } from 'ng2-file-upload';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from '../auth/auth.service';

import { Company } from './company.model'
import { Person } from '../person/person.model';

//-------------------------------------------------------
//                      Services
//-------------------------------------------------------


@Injectable()
export class CompanyService {  
  constructor(private authHttp: AuthHttp, private authService: AuthService) { }
  
  getPersons(company: Company, query: Object = {}): Observable<Person[]> {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    return this.authHttp.get(`${environment.API_BASEURL}/api/companies/${company._id}/persons${queryString ? '?' + queryString : ''}`)
                        .map(res => <Person[]> res.json())
                        .catch(this.handleError);    
  }

  getStatistics(company: Company): Observable<any> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/companies/${company._id}/statistics`)
                        .map(res => res.json())
                        .catch(this.handleError);
  }
  
  getRegisters(company: Company, query: Object = {}): Observable<any> {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    return this.authHttp.get(`${environment.API_BASEURL}/api/companies/${company._id}/registers${queryString ? '?' + queryString : ''}`)
                        .map(res => <Person[]> res.json())
                        .catch(this.handleError);    
  }
  
  exportExcel(company: Company): Observable<any> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/companies/${company._id}/persons/export`, { responseType: ResponseContentType.Blob })
                        .map(res => res.blob())
                        .catch(this.handleError)
  }

  getExcelUploader(company: Company): FileUploader {
    return new FileUploader({ url: `${environment.API_BASEURL}/api/companies/${company._id}/persons/import`, authToken: `Bearer ${this.authService.getAccessToken()}` });
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