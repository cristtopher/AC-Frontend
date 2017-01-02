import { Component, OnInit } from '@angular/core';

import { SocketService } from '../../api/socket/socket.service';
import { SectorService } from '../../api/sector/sector.providers';
import { Sector } from '../../api/sector/sector.model';

import * as moment from 'moment';

@Component({
  selector: 'app-logbook',
  templateUrl: './logbook.component.html',
  styleUrls: ['./logbook.component.css']
})
export class LogbookComponent implements OnInit {
  
  profiles = [{
    id: 'staff',
    name: 'Empleados'
  }, {
    id: 'contractor',
    name: 'Contratistas'
  }, {
    id: 'visitor',
    name: 'Visitas'
  }];
  
  currentSector: Sector;
  currentFixedTimeFilter: string;
  currentProfileFilter: string = "all";
  
  constructor(private socketService: SocketService, private sectorService: SectorService) { }

  ngOnInit() {
    this.sectorService.currentSector.subscribe(currentSector => this.currentSector = currentSector )
  }

  changeProfile(profile: string) {
    console.log(`profile changed to: ${profile}`);
  }

  toggleFilter(filterName: string) {
    
    if(this.currentFixedTimeFilter === filterName) { 
      this.currentFixedTimeFilter = null;
      return;
    }
    
    this.currentFixedTimeFilter = filterName;
    
    var unixTime;
    if (this.currentFixedTimeFilter === 'today') {
      unixTime = moment().unix();
      console.log(`unixtime: ${unixTime}`)
    }
    console.log(`setting currentFixedTimeFilter to: ${filterName}`)
    
  }

}
