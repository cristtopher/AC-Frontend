import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginatorModule } from "ngx-paginator";
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { TagInputModule } from 'ngx-chips';

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminUserModalComponent } from './admin-users/admin-user-modal/admin-user-modal.component';

@NgModule({
  declarations: [
    AdminComponent, 
    AdminUsersComponent,
    AdminUserModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AdminRoutingModule,
    PaginatorModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    TagInputModule
  ],
  exports: [
    AdminComponent
  ],
  entryComponents: [
    AdminUserModalComponent
  ]
})
export class AdminModule { }
