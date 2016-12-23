import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { SocketService } from '../socket/socket.service';
import { AuthService } from '../auth/auth.service';

import { Person } from './Person.model'

//-------------------------------------------------------
//                      Services
//-------------------------------------------------------


@Injectable()
export class PersonService extends Person {
  socket: any;
  
  constructor(private authHttp: AuthHttp, private socketService: SocketService) { 
    super();
  }
  
  getVisits(): Observable<any[]> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/persons?visit=1`)
            .map(res => {
              let json = JSON.parse(res.text());
              return json.map(p => new Person().fromJSON(p));
            })
            .catch(this.handleError);
  }
  
  getPersons(): Observable<Person[]> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/persons`)
                .map(res => {
                  let json = JSON.parse(res.text());
                  
                  return json.map(p => new Person().fromJSON(p));
                })
                .catch(this.handleError);
  }
  
  syncUpdates(): Observable<any> {
    return this.socketService.get('person')
    .map((event) => {
      event.item = new Person().fromJSON(event.item);
      
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
export class PeopleResolve implements Resolve<Person[]> {
  constructor(private personService: PersonService, private socketService: SocketService) {}
  // ugly way to lazily initialize socketService via injecting socketService when /users/me is requested (Can be improved...)

  resolve(route: ActivatedRouteSnapshot) {
    return this.personService.getPersons();
  }
}



//-------------------------------------------------------
//                      Providers
//-------------------------------------------------------

export const PERSON_PROVIDERS: Provider[] = [
  { provide: PersonService, useClass: PersonService },
  { provide: PeopleResolve, useClass: PeopleResolve }
];