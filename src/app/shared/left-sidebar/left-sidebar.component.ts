import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { UserService } from '../../api/user/user.providers';
import { User } from '../../api/user/user.model';

import { Sector } from '../../api/sector/sector.model';
import { SectorService } from '../../api/sector/sector.providers';

import * as _ from 'lodash';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  currentUser: User;
  currentSectorId: string;
  sectors: Sector[];
  
  constructor(private userService: UserService) { }

  ngOnInit() { 
    this.userService.getSectors()
      .map(sectors => _.sortBy(sectors, 'name'))
      .subscribe((sectors: Sector[]) => {
        this.sectors = sectors;
        this.userService.setCurrentSector(sectors[0]);
      });
    
    this.userService.currentUser.subscribe(currentUser => this.currentUser = currentUser);
    this.userService.currentSector.subscribe(currentSector => {
      this.currentSectorId = currentSector._id;
    });
  }
  
  changeSector(sectorId: string) {
    let newSector = _.find(this.sectors, s => s._id === sectorId);
    this.userService.setCurrentSector(newSector);
  }
}
