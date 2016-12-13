import { Injectable, Provider } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../auth/auth.service';

import { User } from './user.model';


@Injectable()
class CurrentUserResolve implements Resolve<User> {
  constructor(private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.authService.getProfile();
  }
}

export const USER_PROVIDERS: Provider[] = [{
  provide: CurrentUserResolve,
  useClass: CurrentUserResolve
}];
