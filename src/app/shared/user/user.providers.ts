import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from '../auth/auth.service';
import { User } from './user.model'

@Injectable()
export class UserService extends User {
  
  socket: any;
  
  constructor(private authHttp: AuthHttp) { 
    super();
    
    this.socket = io(environment.API_BASEURL);
    
    console.log(environment.API_BASEURL);
  }
  
  getUsers() {
    return this.authHttp.get(`${environment.API_BASEURL}/api/users`)
                    .map(res => {
                      console.log(res.text());
                      return res;
                    })
                    .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  } 

}

@Injectable()
export class CurrentUserResolve implements Resolve<User> {
  constructor(private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.authService.getProfile();
  }
}

export const USER_PROVIDERS: Provider[] = [
  { provide: UserService, useClass: UserService },
  { provide: CurrentUserResolve, useClass: CurrentUserResolve }
];

