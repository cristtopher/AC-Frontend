import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent }      from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PeopleManagementComponent } from './people-management/people-management.component';
import { LogbookComponent } from './logbook/logbook.component';
import { UnauthorizedListComponent } from './unauthorized-list/unauthorized-list.component';
import { ManualRegisterComponent } from './manual-register/manual-register.component';
import { OverviewComponent } from './overview/overview.component';

import { CanActivateAuthGuard } from '../api/auth/auth-guard.service';
import { CurrentUserResolve }   from '../api/user/user.providers';

@NgModule({
  imports: [
    RouterModule.forChild([{ 
      path: 'home', 
      component: HomeComponent,
      canActivate: [CanActivateAuthGuard],
      resolve: { currentUser: CurrentUserResolve },
      children: [{
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'prefix'
        }, {
          path: 'overview',
          component: OverviewComponent
        }, {
          path: 'dashboard',
          component: DashboardComponent
        }, {
          path: 'peopleManagement',
          component: PeopleManagementComponent
        }, {
          path: 'logbook',
          component: LogbookComponent
        }, {
          path: 'manualRegister',
          component: ManualRegisterComponent
        }, {
          path: 'unauthorizedList',
          component: UnauthorizedListComponent
        }]
    }])
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }
