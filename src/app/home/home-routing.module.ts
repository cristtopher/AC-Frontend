import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { CanActivateAuthGuard } from '../shared/auth/auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([{ 
      path: 'home', 
      component: HomeComponent,
      canActivate: [CanActivateAuthGuard],
      children: [{
          path:'',
          component: DashboardComponent
        }, {
          path:'dashboard',
          component: DashboardComponent
        }]
    }])
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }
