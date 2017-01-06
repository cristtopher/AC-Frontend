import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from '../auth/auth.service';

import { Register } from './register.model'

//-------------------------------------------------------
//                      Services
//-------------------------------------------------------


@Injectable()
export class RegisterService {
  
  constructor(private authHttp: AuthHttp) { }
  
  get(query: Object = {}): Observable<Register[]> {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
        
    return this.authHttp.get(`${environment.API_BASEURL}/api/registers${queryString ? '?' + queryString : ''}`)
                        .map(res => <Register[]> res.json())
                        .catch(this.handleError);
  }
  
  create(register: Register) {
    console.log('going to create a new register....')
    
    return this.authHttp.post(`${environment.API_BASEURL}/api/registers`, {
      person: register.person._id,
      sector: register.sector._id,
      time: register.time,
      type: register.type,
      comment: register.comment
    })
    .map(res => <Register[]> res.json())
    .do(() => {
      console.log('done...')
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



//-------------------------------------------------------
//                      Providers
//-------------------------------------------------------

export const REGISTER_PROVIDERS: Provider[] = [
  { provide: RegisterService, useClass: RegisterService }
];