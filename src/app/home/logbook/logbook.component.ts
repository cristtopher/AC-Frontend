import { Component, OnInit } from '@angular/core';

import { UserService }     from '../../api/user/user.providers';
import { RegisterService } from '../../api/register/register.providers';
import { SectorService }   from '../../api/sector/sector.providers';
import { SocketService }   from '../../api/socket/socket.service';
import { HUMANIZED_PERSON_PROFILES } from '../../api/person/person.providers';

import { Sector }   from '../../api/sector/sector.model';
import { Register } from '../../api/register/register.model';

import * as moment from 'moment';
import * as _ from 'lodash';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-logbook',
  templateUrl: './logbook.component.html',
  styleUrls: ['./logbook.component.css']
})
export class LogbookComponent implements OnInit {  
  currentSector: Sector;

  registers: Register[];  
  
  currentFilters = {
    type: 'entry',
    from: null,
    personType: null,
    incomplete: false
  };
    
  // variables to handle filter controls behavior
  currentDateTimeFilterName: string;
  currentProfileFilterControl: string = "all";
  
  humanizedPersonProfiles = HUMANIZED_PERSON_PROFILES;
  
  constructor(private socketService: SocketService, 
              private userService: UserService, 
              private sectorService: SectorService, 
              private registerService: RegisterService) { }

  ngOnInit() {
    this.userService.currentSector
                      .mergeMap(currentSector => {
                        this.currentSector = currentSector;
      
                        return this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters));
                      })
                      .subscribe(registers => this.registers = registers)
  }

  changeProfileFilter(profile: string) {
    this.currentFilters.personType = profile !== "all" ? profile : null;
    
    this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters))
                      .subscribe(registers => this.registers = registers);
  }

  toggleIncompleteFilter() {
      this.currentFilters['incomplete'] = !this.currentFilters['incomplete'];
      
      this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters))
                        .subscribe(registers => this.registers = registers)
  }

  toggleDateTimeFilter(filterName: string) {    
    // for time-based filter buttons
    if(filterName === this.currentDateTimeFilterName) { 
      // means that the filter will be deactivated...      
      this.currentDateTimeFilterName = null;
      this.currentFilters['from'] = null;
    } else {
      // means that a filter will be activated...
      this.currentDateTimeFilterName = filterName;
    
      if (this.currentDateTimeFilterName === 'today') {
        this.currentFilters.from = moment().startOf('day').unix() * 1000;
      } else if (this.currentDateTimeFilterName === 'last7days') {
        this.currentFilters.from = moment().startOf('day').subtract(7, 'days').unix() * 1000;
      } else if (this.currentDateTimeFilterName === 'last15days') {
        this.currentFilters.from = moment().startOf('day').subtract(15, 'days').unix() * 1000;
      } else if (this.currentDateTimeFilterName === 'last30days') {
        this.currentFilters.from = moment().startOf('day').subtract(30, 'days').unix() * 1000;
      }
    }
        
    this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters))
                      .subscribe(registers => this.registers = registers)
  }

  resolveRegister(register: Register){
        
    // creating new register... 
    var newRegister = new Register();
    
    newRegister.person     = register.person;
    newRegister.comments   = 'Resolución manual';
    newRegister.type       = 'depart';
    newRegister.isResolved = true;
    newRegister.time       = moment(new Date()).unix() * 1000;
    newRegister.sector     = register.sector;

    this.registerService.create(newRegister)
      .flatMap((newRegister) => {
        register.isResolved = true;
        register.resolvedRegister = newRegister._id;
        return this.registerService.patch(register, {
          resolvedRegister: newRegister._id,
          isResolved: true
        });
      })                               
      .subscribe(resolvedRegister => {
        register.resolvedRegister = newRegister;
      }, (error) => {
        console.log(`error while creating register: ${error}`);
      });
    
  }
  
  //exportExcel() {
  //  console.log('Exporting logbook to excel...');
  //}

  exportExcel() { 
    this.sectorService.exportExcel(this.currentSector)
    .subscribe(data  => fileSaver.saveAs(data, 'registers-export.xlsx'),
               error => console.log("Error downloading the file."),
               ()    => console.log('Completed file download.'));
  }

}
