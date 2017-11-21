import { environment } from '../../../environments/environment';

import { Injectable, Provider } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { FileUploader } from 'ng2-file-upload';

import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';

import { Vehicle } from './vehicle.model'


// -------------------------------------------------------
//                      Constants
// -------------------------------------------------------

export const HUMANIZED_VEHICLE_TYPES = {
  'car': 'Automovil',
  'truck': 'Camion',
  'pickup': 'Camioneta',
  'van': 'Furgon',
  'bus': 'Bus',
  'motorcycle': 'Moto'
};

// -------------------------------------------------------
//                      Services
// -------------------------------------------------------

@Injectable()
export class VehicleService {

  constructor(private authHttp: AuthHttp, private authService: AuthService) { }

  deleteVehicle(vehicle: Vehicle): Observable<any> {
    return this.authHttp.delete(`${environment.API_BASEURL}/api/vehicles/${vehicle._id}`)
                        .catch(this.handleError);
  }

  get(query: Object = {}): Observable<Vehicle[]> {
    let queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');

    return this.authHttp.get(`${environment.API_BASEURL}/api/vehicles${queryString ? '?' + queryString : ''}`)
                .map(res => <Vehicle> res.json())
                .catch(this.handleError);
  }

  getOneById(vehicle: Vehicle): Observable<any> {
    return this.authHttp.get(`${environment.API_BASEURL}/api/vehicles/${vehicle._id}`)
      .map(res => <Vehicle>res.json())
      .catch(this.handleError);
  }

  updateVehicle(vehicle: Vehicle): Observable<any> {
    return this.authHttp.put(`${environment.API_BASEURL}/api/vehicles/${vehicle._id}`, vehicle)
                        .map(res => <Vehicle> res.json())
                        .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}

// -------------------------------------------------------
//                      Providers
// -------------------------------------------------------

export const VEHICLE_PROVIDERS: Provider[] = [
  { provide: VehicleService, useClass: VehicleService }
];
