import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsModule } from 'ng2-charts/ng2-charts';


import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { TopHeaderComponent } from './top-header/top-header.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { BarChartComponent } from './dashboard/bar-chart/bar-chart.component';
import { PieChartComponent } from './dashboard/pie-chart/pie-chart.component';
import { SectionComponent } from './left-sidebar/section/section.component';
import { GroupSectionComponent } from './left-sidebar/group-section/group-section.component';

@NgModule({
  declarations: [
    HomeComponent,
    LeftSidebarComponent,
    TopHeaderComponent,
    DashboardComponent,
    BarChartComponent,
    PieChartComponent,
    SectionComponent,
    GroupSectionComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ChartsModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
