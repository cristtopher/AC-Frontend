import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { TopHeaderComponent } from './top-header/top-header.component';

import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    HomeComponent,
    LeftSidebarComponent,
    TopHeaderComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
