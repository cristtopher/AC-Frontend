import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css'],
  inputs:  ['currentUser']
})
export class LeftSidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
