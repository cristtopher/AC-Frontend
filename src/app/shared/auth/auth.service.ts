import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { AuthHttp, tokenNotExpired } from 'angular2-jwt';

import { environment } from '../../../environments/environment';

import { User } from '../user/user.model';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';


@Injectable()
export class AuthService {
    
  constructor(private router: Router, private http: Http, private authHttp: AuthHttp) { }
  
  login(username: string, password: string): Observable<any> {
    console.log(`username: ${username}`);
    console.log(`password: ${password}`);
    console.log(`environment.API_BASEURL: ${environment.API_BASEURL}`)
    
    return this.http.post(`${environment.API_BASEURL}/auth/local`, {rut: username, password: password}, new Headers({ 'Content-Type': 'application/json' }))
                    .map((res: Response) => {
                      let json = res.json();
                      
                      if (!json.fail) {
                        localStorage.setItem("id_token", json.token);
                      }
                      
                      return json.token;
                    });
                 
  }

  logout(): Observable<any> {
    localStorage.removeItem("id_token");    
    return Observable.fromPromise(this.router.navigate(['/']));
  }
  
  loggedIn() {
    return tokenNotExpired();
  }

  getAccessToken() {
    return localStorage.getItem("id_token");
  }
  
	getProfile(): Observable<User> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/users/me`)
              .map((res: Response) => {
                let json = res.json();
                
                let user = new User().fromJSON(json);
                console.log(`getProfile: ${user}`)
                
                return user;
              });
	}
    
}