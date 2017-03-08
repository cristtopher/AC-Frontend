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
  totalPages  = 1;
  currentPage = 1;
  
  currentFilters = {
    type: 'entry',
    from: null,
    personType: null,
    incomplete: false,
    page: 1
  };
  
  // variables to handle filter controls behavior
  currentDateTimeFilterName: string;
  currentProfileFilterControl: string = "all";
  
  humanizedPersonProfiles = HUMANIZED_PERSON_PROFILES;
  
  // variable to mantain track of currently comments being edited
  editingComments = {};
  
  constructor(private socketService: SocketService, 
              private userService: UserService, 
              private sectorService: SectorService, 
              private registerService: RegisterService) { }

  ngOnInit() {

    this.socketService.get('register').subscribe((event) => {                        
       // TODO: Replace this by just appending/removing new event instead of requesting all data
       this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters))
                         .subscribe(registers => {
                           this.totalPages  = registers.pages;
                           this.currentPage = registers.page;
                           this.registers   = registers.data;
                         });
    });  
                     
    this.userService.currentSector
                      .mergeMap(currentSector => {
                        this.currentSector = currentSector;
      
                        return this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters));
                      })
                      .subscribe(registers => {
                        
                        console.log(`got registers... totalPages: ${this.totalPages}, currentPage: ${this.currentPage}`)
                        
                        this.totalPages  = registers.pages;
                        this.currentPage = registers.page;
                        this.registers   = registers.data;
                      });
  }


  //-------------------------
  //    Bussiness Logic
  //-------------------------

  resolveRegister(register: Register){
        
    // creating new register... 
    var newRegister = new Register();
    
    newRegister.person     = register.person;
    newRegister.type       = 'depart';
    newRegister.isResolved = true;
    newRegister.time       = moment(new Date()).unix() * 1000;
    newRegister.sector     = register.sector;

    this.registerService.create(newRegister)
      .flatMap((newRegister) => {
        register.isResolved = true;
        register.resolvedRegister = newRegister._id;
        return this.registerService.patch(register, [
          { op: 'replace', path: '/resolvedRegister', value: 'newRegister._id' },
          { op: 'replace', path: '/isResolved', value: true }
        ]);
      })                               
      .subscribe(resolvedRegister => {
        register.resolvedRegister = newRegister;
      }, (error) => {
        console.log(`error while creating register: ${error}`);
      });
    
  }
  
  exportExcel() { 
    this.sectorService.exportExcel(this.currentSector)
    .subscribe(data  => fileSaver.saveAs(data, 'registers-export.xlsx'),
               error => console.log("Error downloading the file."),
               ()    => console.log('Completed file download.'));
  }


  //-------------------------
  //   Filtering Functions
  //-------------------------

  changeProfileFilter(profile: string) {
    this.currentFilters.personType = profile !== "all" ? profile : null;
    
    this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters))
                      .subscribe(registers => {
                        this.totalPages  = registers.pages;
                        this.currentPage = registers.page;
                        this.registers   = registers.data;
                      });
  }

  toggleIncompleteFilter() {
      this.currentFilters['incomplete'] = !this.currentFilters['incomplete'];
      
      this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters))
                        .subscribe(registers => {
                          this.totalPages  = registers.pages;
                          this.currentPage = registers.page;
                          this.registers   = registers.data;
                        });
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
                      .subscribe(registers => {
                        this.totalPages  = registers.pages;
                        this.currentPage = registers.page;
                        this.registers   = registers.data;
                      });
  }


  //-------------------------
  //    Comment Editing
  //-------------------------

  isCommentEditing(register: Register) {
    return this.editingComments[register._id] === true;
  }
  
  editComment(register: Register){
    this.editingComments[register._id] = true;
  }
      
  closeEditComment(register: Register) {
    delete this.editingComments[register._id];
  }
  
  saveEdittedComment(register: Register) {
    this.registerService.patch(register, [{ op: 'replace', path: '/comments', value: register.comments }])
                        .subscribe(patchedRegister => { 
                          register.comments = patchedRegister.comments;
                          this.closeEditComment(register);
                        });
  }
  
  //-------------------------
  //    Paging Handling
  //-------------------------

  nextPage() {
    this.currentFilters["page"]++;
      
    this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters))
                      .subscribe(registers => {
                        this.totalPages  = registers.pages;
                        this.currentPage = registers.page;
                        this.registers   = registers.data;
                      });
  }

  previousPage() {
    this.currentFilters["page"] > 1 ? this.currentFilters["page"]-- : this.currentFilters["page"];
        
    this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters))
                      .subscribe(registers => {
                        this.totalPages  = registers.pages;
                        this.currentPage = registers.page;
                        this.registers   = registers.data;
                      });
  }

}
