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
  
  get(): Observable<Register[]> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/registers`)
                        .map(res => {
                          let json = res.json();
              
                          return json.map(p => new Register().fromJSON(p));
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