import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';

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
  
  constructor(private authHttp: AuthHttp) { }
  
  getPersons(company: Company, query: Object = {}): Observable<Person[]> {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    return this.authHttp.get(`${environment.API_BASEURL}/api/companies/${company._id}/persons${queryString ? '?' + queryString : ''}`)
                        .map(res => <Person[]> res.json())
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



//-------------------------------------------------------
//                      Providers
//-------------------------------------------------------

export const COMPANY_PROVIDERS: Provider[] = [
  { provide: CompanyService, useClass: CompanyService }
];