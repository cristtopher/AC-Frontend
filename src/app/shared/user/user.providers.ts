import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from '../auth/auth.service';

import { User } from './user.model'

//-------------------------------------------------------
//                      Services
//-------------------------------------------------------


@Injectable()
export class UserService extends User {
  socket: any;
  
  constructor(private authHttp: AuthHttp) { 
    super();
  }
  
  getUsers() {
    return this.authHttp.get(`${environment.API_BASEURL}/api/users`)
                        .map(res => {
                          let json = res.json();
                          
                          return json.map(u => new User().fromJSON(u));
                        })
                        .catch(this.handleError);
  }
  
  deleteUser(user: User){
    return this.authHttp.delete(`${environment.API_BASEURL}/api/users/${user._id}`)
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
export class CurrentUserResolve implements Resolve<User> {
  constructor(private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.authService.getProfile();
  }
}


//-------------------------------------------------------
//                      Providers
//-------------------------------------------------------

export const USER_PROVIDERS: Provider[] = [
  { provide: UserService, useClass: UserService },
  { provide: CurrentUserResolve, useClass: CurrentUserResolve }
];