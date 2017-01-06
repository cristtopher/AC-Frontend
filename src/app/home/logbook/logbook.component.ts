import { Component, OnInit } from '@angular/core';

import { UserService } from '../../api/user/user.providers';
import { SectorService } from '../../api/sector/sector.providers';
import { SocketService } from '../../api/socket/socket.service';

import { Sector } from '../../api/sector/sector.model';
import { Register } from '../../api/register/register.model';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-logbook',
  templateUrl: './logbook.component.html',
  styleUrls: ['./logbook.component.css']
})
export class LogbookComponent implements OnInit {  
  currentSector: Sector;

  registers: Register[];  
  currentFilters = {
    from: null,
    personType: null,
    incomplete: null
  };
  
  // variables to handle filter controls behavior
  currentToggleableFilter: string;
  currentProfileFilterControl: string = "all";
  
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
  
  constructor(private socketService: SocketService, private userService: UserService, private sectorService: SectorService) { }

  ngOnInit() {
    this.userService.currentSector
                      .mergeMap(currentSector => {
                        this.currentSector = currentSector;
      
                        return this.sectorService.getRegisters(this.currentSector);
                      })
                      .subscribe(registers => this.registers = registers)
  }

  changeProfileFilter(profile: string) {
    this.currentFilters.personType = profile !== "all" ? profile : null;
    
    this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters))
                      .subscribe(registers => this.registers = registers);
  }

  toggleFilter(filterName: string) {    
    if(filterName === this.currentToggleableFilter) { 
      // means that the filter will be deactivated...      
      this.currentToggleableFilter = null;
      this.currentFilters[filterName === 'incomplete' ? 'incomplete' : 'from'] = null;
    } else {
      // means that a filter will be activated...
      this.currentToggleableFilter = filterName;
    
      if (this.currentToggleableFilter === 'today') {
        this.currentFilters.from = moment().startOf('day').unix() * 1000;
      } else if (this.currentToggleableFilter === 'last7days') {
        this.currentFilters.from = moment().startOf('day').subtract(7, 'days').unix() * 1000;
      } else if (this.currentToggleableFilter === 'last15days') {
        this.currentFilters.from = moment().startOf('day').subtract(15, 'days').unix() * 1000;
      } else if (this.currentToggleableFilter === 'last30days') {
        this.currentFilters.from = moment().startOf('day').subtract(30, 'days').unix() * 1000;
      } else if (this.currentToggleableFilter === 'incomplete') {
        this.currentFilters.incomplete = true;
      }
    }
        
    this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters))
                      .subscribe(registers => this.registers = registers)
  }

  resolveRegister(register: Register){
    console.log(`resolveRegister called with args: ${JSON.stringify(register)}`);
    register.isResolved = true;
    // TODO: make api request...
  }

}
