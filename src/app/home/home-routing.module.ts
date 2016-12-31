import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent }      from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PeopleManagementComponent } from './people-management/people-management.component';

import { CanActivateAuthGuard } from '../api/auth/auth-guard.service';
import { CurrentUserResolve }   from '../api/user/user.providers';
import { SectorsResolve }   from '../api/sector/sector.providers';

@NgModule({
  imports: [
    RouterModule.forChild([{ 
      path: 'home', 
      component: HomeComponent,
      canActivate: [CanActivateAuthGuard],
      resolve: { currentUser: CurrentUserResolve, sectors: SectorsResolve },
      children: [{
          path: '',
          redirectTo: 'dashboard'
        }, {
          path: 'dashboard',
          component: DashboardComponent
        }, {
          path: 'peopleManagement',
          component: PeopleManagementComponent
        }]
    }])
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }
