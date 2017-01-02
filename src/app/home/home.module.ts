import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

import { Typeahead } from 'ng2-typeahead';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PeopleManagementComponent } from './people-management/people-management.component';
import { PersonModalComponent } from './people-management/person-modal/person-modal.component';
import { LogbookComponent } from './logbook/logbook.component';
import { ManualRegisterComponent } from './manual-register/manual-register.component';

@NgModule({
  declarations: [
    Typeahead,
    HomeComponent,
    DashboardComponent,
    PeopleManagementComponent,
    PersonModalComponent,
    LogbookComponent,
    ManualRegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ChartsModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    Ng2DatetimePickerModule,
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
