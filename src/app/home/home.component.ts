import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../api/user/user.model';
import { Sector } from '../api/sector/sector.model';

import { UserService } from '../api/user/user.providers';
import { SocketService } from '../api/socket/socket.service';

import * as moment from 'moment';
import 'moment/min/locales';

declare var Chart:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  
  unauthorizedListBadge: number = 0;
  dashboardBadge: number        = 0;

  constructor(private route: ActivatedRoute, private userService: UserService, private socketService: SocketService) { }

  ngOnInit() {    
    this.userService.currentUser.subscribe(currentUser => this.currentUser = currentUser);
    
    this.socketService.get('register')
                  .filter(e => e.item.sector == this.userService.currentSector.getValue()._id)
                  .subscribe((event) => {
                    if (event.item.isUnauthorized) { 
                      this.unauthorizedListBadge++; 
                    }
                    else if (event.action == "save")   { this.dashboardBadge++; }
                  });
    
    // TODO: hardcoded locale
    moment.locale('es-cl');

    Chart.defaults.global.title.fontColor = '#FFFFFF';
    Chart.defaults.global.defaultColor = 'rgba(255, 255, 255, 1)';
    Chart.defaults.global.defaultFontColor = 'rgba(255, 255, 255, 1)';
  }

  dashboardSectionClicked(){
    this.dashboardBadge = 0;
  }

  unauthorizedListSectionClicked(){
    this.unauthorizedListBadge = 0;
  }

}
