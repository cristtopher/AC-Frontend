import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from '../auth/auth.service';
import { SocketService } from '../socket/socket.service';

import { User } from './user.model'

//-------------------------------------------------------
//                      Services
//-------------------------------------------------------


@Injectable()
export class UserService extends User {
  
  socket: any;
  
  constructor(private authHttp: AuthHttp, private socketService: SocketService) { 
    super();
  }
  
  getUsers() {
    return this.authHttp.get(`${environment.API_BASEURL}/api/users`)
                    .map(res => {
                      console.log(res.text());
                      return res;
                    })
                    .catch(this.handleError);
  }
  
  syncUpdates(): Observable<any> {
    return this.socketService.get('user')
    .map((event) => {
      event.item = new User().fromJSON(event.item);
      
      return event;
    });
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

