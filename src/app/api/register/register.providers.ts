import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Response, ResponseContentType } from '@angular/http';
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
    return this.authHttp.post(`${environment.API_BASEURL}/api/registers`, {
      person: register.person._id,
      sector: register.sector._id,
      time: register.time,
      type: register.type,
      comments: register.comments
    })
    .map(res => <Register[]> res.json())
    .catch(this.handleError);
    
  }
  
  update(register: Register) {
     console.log(`going to update register: ${register}`)
    return  this.authHttp.put(`${environment.API_BASEURL}/api/registers/${register._id}`, register)
                         .map(res => <Register> res.json())
                         .catch(this.handleError);
  }

  patch(register: Register, data) {
    console.log(`going to patch register: ${register}`)
    return this.authHttp.patch(`${environment.API_BASEURL}/api/registers/${register._id}`, data)
                         .map(res => <Register> res.json())
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