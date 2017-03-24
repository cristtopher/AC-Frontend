import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '/home/dashboard',  pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'home', component: HomeComponent },
      { path: 'admin', component: AdminComponent },
      { path: '**', redirectTo: '/login' }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}