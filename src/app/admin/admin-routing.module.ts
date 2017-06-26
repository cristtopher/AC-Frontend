import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminComponent }      from './admin.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';

import { CanActivateAuthGuard } from '../api/auth/auth-guard.service';
import { CurrentUserResolve }   from '../api/user/user.providers';

@NgModule({
  imports: [
    RouterModule.forChild([{ 
      path: 'admin', 
      component: AdminComponent,
      canActivate: [CanActivateAuthGuard],
      resolve: { currentUser: CurrentUserResolve },
      children: [{
          path: '',
          redirectTo: 'users',
          pathMatch: 'prefix'
        }, {
          path: 'users',
          component: AdminUsersComponent
        }]
    }])
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
