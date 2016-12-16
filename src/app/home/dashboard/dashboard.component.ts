import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user/user.providers';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  constructor(private userService: UserService) {
  }

  ngOnInit() {
    console.log('Trying to render Dashboard Component');
    
    
  }

  

}
