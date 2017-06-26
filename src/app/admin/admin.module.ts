import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from "ngx-paginator";

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';

@NgModule({
  declarations: [
    AdminComponent, 
    AdminUsersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    PaginatorModule
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
