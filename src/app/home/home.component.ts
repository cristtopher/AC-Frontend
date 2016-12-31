import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../api/user/user.model';
import { Sector } from '../api/sector/sector.model';

import { UserService } from '../api/user/user.providers';

declare var Chart:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  //sectors: Sector[];
  
  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(currentUser => this.currentUser = currentUser);
    
    // this.sectors     = this.route.snapshot.data['sectors'];
    // this.currentUser = this.route.snapshot.data['currentUser'];
        
    Chart.defaults.global.title.fontColor = '#FFFFFF';
    Chart.defaults.global.defaultColor = 'rgba(255, 255, 255, 1)';
    Chart.defaults.global.defaultFontColor = 'rgba(255, 255, 255, 1)';
  }

}
