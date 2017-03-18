import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import { PaginatorModule } from "ngx-paginator";

import { FileSelectDirective } from 'ng2-file-upload';

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PeopleManagementComponent } from './people-management/people-management.component';
import { PersonModalComponent } from './people-management/person-modal/person-modal.component';
import { LogbookComponent } from './logbook/logbook.component';
import { ManualRegisterComponent } from './manual-register/manual-register.component';
import { OverviewComponent } from './overview/overview.component';
import { ImportModalComponent } from './people-management/import-modal/import-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    PeopleManagementComponent,
    PersonModalComponent,
    LogbookComponent,
    ManualRegisterComponent,
    OverviewComponent,
    ImportModalComponent,
    FileSelectDirective
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    Ng2DatetimePickerModule,    
    HomeRoutingModule,
    PaginatorModule
  ],
  exports: [
    HomeComponent
  ],
  entryComponents: [
    PersonModalComponent,
    ImportModalComponent
  ]
})
export class HomeModule { }
