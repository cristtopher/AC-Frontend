import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';

import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';

import { User }    from './user.model';
import { Company } from '../company/company.model';
import { Sector }  from '../sector/sector.model';

//-------------------------------------------------------
//                      Services
//-------------------------------------------------------


@Injectable()
export class UserService {  
  currentUser: BehaviorSubject<User>       = new BehaviorSubject<User>(null);
  currentCompany: BehaviorSubject<Company> = new BehaviorSubject<Company>(null); 
  currentSector: BehaviorSubject<Sector>   = new BehaviorSubject<Sector>(null); 
  
  constructor(private authHttp: AuthHttp) { }
  
  setCurrentUser(user: User) {
    this.currentUser.next(user);
  }

  setCurrentCompany(company: Company) {
    this.currentCompany.next(company);
  }
  
  setCurrentSector(sector: Sector) {
    this.currentSector.next(sector);
  }
  
  getMyCompanies(): Observable<Company[]> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/users/me/companies`)
                        .map(res => <Company[]> res.json())
                        .share()
                        .catch(this.handleError);
  }
  
  getMySectors(company: Company): Observable<Sector[]> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/users/me/companies/${company._id}/sectors`)
                        .map(res => <Sector[]> res.json())
                        .share()
                        .catch(this.handleError);
  }
      
  get(query: Object = {}) {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    return this.authHttp.get(`${environment.API_BASEURL}/api/users${queryString ? '?' + queryString : ''}`)
                        .map(res => {
                          if (!query['paging']) { return <User[]> res.json(); }
                          
                          return {
                            page: parseInt(res.headers.get('X-Pagination-Page')),
                            pages: parseInt(res.headers.get('X-Pagination-Pages')),
                            users: <User[]> res.json()
                          } 
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
  constructor(private router: Router, private authService: AuthService, private userService: UserService) {}

  // before rendering anything, some Subjects are defined: currentUser, currentCompany, currentSector
  resolve(route: ActivatedRouteSnapshot) {    
    
    let userdata$ = Observable.of(null)
                      .flatMap(() => this.userService.getMyCompanies())
                      .do(currentUserCompanies => this.userService.setCurrentCompany(currentUserCompanies[0]))
                      .flatMap(currentUserCompanies => this.userService.getMySectors(currentUserCompanies[0]))
                      .do(firstCompanySectors => this.userService.setCurrentSector(firstCompanySectors[0]));
 
    
    return this.authService.getProfile()
                           .do(currentUser => this.userService.setCurrentUser(currentUser))
                           .map(currentUser => currentUser.role === 'admin' ? Observable.of(null) : userdata$)
                           .switch()
                           .toPromise()
                           .then(() => {
                              let currentUser = this.userService.currentUser.getValue();
                              if (!currentUser) { return new User(); }
                              
                              return currentUser;
                            })
                            .catch((response:Response) => {
                              // TODO: remove redirect from service (create a shared component for error page)
                              this.router.navigate(['/500']);
                              return Observable.empty();
                           })    
     
  }
}


//-------------------------------------------------------
//                      Providers
//-------------------------------------------------------

export const USER_PROVIDERS: Provider[] = [
  { provide: UserService, useClass: UserService },
  { provide: CurrentUserResolve, useClass: CurrentUserResolve }
];