import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../shared/user/user.model';
import { Sector } from '../shared/sector/sector.model';

declare var Chart:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  sectors: Sector[];
  
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sectors     = this.route.snapshot.data['sectors'];
    this.currentUser = this.route.snapshot.data['currentUser'];
    
    this.currentUser.currentSector = this.sectors[0];
    
    Chart.defaults.global.title.fontColor = '#FFFFFF';
    Chart.defaults.global.defaultColor = 'rgba(255, 255, 255, 1)';
    Chart.defaults.global.defaultFontColor = 'rgba(255, 255, 255, 1)';
  }

}
