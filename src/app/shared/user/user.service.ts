import { environment } from '../../../environments/environment';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { User } from './user.model'

@Injectable()
export class UserService extends User {
  constructor(private authHttp: AuthHttp) { 
    super();
    
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
