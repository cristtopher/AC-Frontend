import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
    FormsModule,
    RouterModule
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
