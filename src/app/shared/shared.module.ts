import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { TopHeaderComponent } from './top-header/top-header.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { SectionComponent } from './left-sidebar/section/section.component';
import { GroupSectionComponent } from './left-sidebar/group-section/group-section.component';

import { SharedComponent } from './shared.component';


@NgModule({
  declarations: [
    SharedComponent,
    LeftSidebarComponent,
    TopHeaderComponent,
    SectionComponent,
    GroupSectionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ChartsModule
  ],
  exports: [
    SharedComponent,
    LeftSidebarComponent,
    TopHeaderComponent,
    SectionComponent,
    GroupSectionComponent
  ]
})
export class SharedModule { }
