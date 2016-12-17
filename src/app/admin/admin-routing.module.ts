import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminComponent }      from './admin.component';
import { ListUsersComponent } from './list-users/list-users.component';

import { CanActivateAuthGuard } from '../shared/auth/auth-guard.service';
import { CurrentUserResolve }   from '../shared/user/user.providers';

@NgModule({
  imports: [
    RouterModule.forChild([{ 
      path: 'admin', 
      component: AdminComponent,
      canActivate: [CanActivateAuthGuard],
      resolve: { currentUser: CurrentUserResolve },
      children: [{
          path: '',
          redirectTo: 'users'
        }, {
          path: 'users',
          component: ListUsersComponent
        }]
    }])
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
