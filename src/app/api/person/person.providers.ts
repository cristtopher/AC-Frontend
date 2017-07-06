import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { FileUploader } from 'ng2-file-upload';

import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';

import { Person } from './person.model'


//-------------------------------------------------------
//                      Constants
//-------------------------------------------------------

export const HUMANIZED_PERSON_PROFILES = {
  'staff': 'Empleado',
  'contractor': 'Contratista',
  'visitor': 'Visita',
  'supplier': 'Supplier'
};

//-------------------------------------------------------
//                      Services
//-------------------------------------------------------


@Injectable()
export class PersonService {
    
  constructor(private authHttp: AuthHttp, private authService: AuthService) { }
  
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
    
  updatePerson(person: Person): Observable<any> {
    return this.authHttp.put(`${environment.API_BASEURL}/api/persons/${person._id}`, person)
                        .map(res => <Person> res.json())
                        .catch(this.handleError);
  }


  exportExcel(): Observable<any> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/persons/export`, { responseType: ResponseContentType.Blob })
                        .map(res => res.blob())
                        .catch(this.handleError)
  }

  getExcelUploader(): FileUploader {
    return new FileUploader({ url: `${environment.API_BASEURL}/api/persons/import`, authToken: `Bearer ${this.authService.getAccessToken()}` });
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
