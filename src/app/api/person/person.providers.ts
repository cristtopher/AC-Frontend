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
//                      Constants
//-------------------------------------------------------

export const HUMANIZED_PERSON_PROFILES = {
  'staff': 'Empleado',
  'contractor': 'Contratista',
  'visitor': 'Visita'
};

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
      
  get(query: Object = {}): Observable<Person[]> {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    return this.authHttp.get(`${environment.API_BASEURL}/api/persons${queryString ? '?' + queryString : ''}`)
                .map(res => <Person[]> res.json())
                .catch(this.handleError);
  }
  
  createPerson(person: Person): Observable<any> {
    return this.authHttp.post(`${environment.API_BASEURL}/api/persons`, person)
                        .map(res => <Person> res.json())
                        .catch(this.handleError);
  }
  
  updatePerson(person: Person): Observable<any> {
    return this.authHttp.put(`${environment.API_BASEURL}/api/persons/${person._id}`, person)
                        .map(res => <Person> res.json())
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