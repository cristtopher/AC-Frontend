import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PeopleManagementComponent } from './people-management/people-management.component';
import { PersonModalComponent } from './people-management/person-modal/person-modal.component';
import { LogbookComponent } from './logbook/logbook.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    PeopleManagementComponent,
    PersonModalComponent,
    LogbookComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ChartsModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    HomeRoutingModule
  ],
  exports: [
    HomeComponent
  ],
  entryComponents: [
    PersonModalComponent
  ]
})
export class HomeModule { }
