import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../shared/user/user.model';


@Component({
  selector: 'home-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  @Input() currentUser: User;
  
  constructor() {
  }

  ngOnInit() {

  }

  toggleMenu() {
    //$(this).parent().toggleClass('open');  
  }

}
