import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from '../auth/auth.service';

import { Person } from './person.model'

//-------------------------------------------------------
//                      Services
//-------------------------------------------------------


@Injectable()
export class PersonService {
  
  constructor(private authHttp: AuthHttp) { }
  
  deletePerson(person: Person): Observable<any> {
    return this.authHttp.delete(`${environment.API_BASEURL}/api/persons/${person._id}`)
                        .catch(this.handleError);
  }
    
  getVisits(): Observable<Person[]> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/persons?visit=1`)
            .map(res => {
              let json = res.json();
              
              return json.map(p => new Person().fromJSON(p));
            })
            .catch(this.handleError);
  }
  
  get(): Observable<Person[]> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/persons`)
                .map(res => {
                  let json = res.json();
                  
                  return json.map(p => new Person().fromJSON(p));
                })
                .catch(this.handleError);
  }
  
  createPerson(person: Person): Observable<any> {
    return this.authHttp.post(`${environment.API_BASEURL}/api/persons`, person)
                        .map(res => {
                          let json = res.json();
                  
                          return new Person().fromJSON(json);
                        })
                        .catch(this.handleError);
  }
  
  updatePerson(person: Person): Observable<any> {
    return this.authHttp.put(`${environment.API_BASEURL}/api/persons/${person._id}`, person)
                        .map(res => {
                          let json = res.json();
                  
                          return new Person().fromJSON(json);
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

export const PERSON_PROVIDERS: Provider[] = [
  { provide: PersonService, useClass: PersonService }
];