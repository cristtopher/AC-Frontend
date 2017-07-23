import { Component, OnInit, OnDestroy } from '@angular/core';

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
  activeSubscriptions = [];
  
  currentSector: Sector;

  registers: Register[] = [];
  totalPages  = 1;
  currentPage = 1;
  
  fromDate = null;
  toDate = null;
  
  currentFilters = {
    type: 'entry',
    from: null,
    to: null,
    personType: null,
    personName: null,
    personRut: null,
    incomplete: false,
    paging: true,
    page: 1
  };
  
  // variables to handle filter controls behavior
  currentDateTimeFilterName: string;
  currentProfileFilterControl: string = 'all';

  humanizedPersonProfiles = HUMANIZED_PERSON_PROFILES;
    
  // variable to mantain track of currently comments being edited
  editingComments = {};
      
  constructor(private socketService: SocketService, 
              private userService: UserService, 
              private sectorService: SectorService, 
              private registerService: RegisterService) { }

  ngOnInit() {

    this.activeSubscriptions.push(
      this.socketService.get('register')
        .filter(event => !event.item.isUnauthorized)
        .flatMap(event => this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters)))
        .subscribe(registers => {
           this.totalPages  = registers.pages;
           this.currentPage = registers.page;
           this.registers   = registers.data;
         })      
    );

    this.activeSubscriptions.push(
      this.userService.currentSector
        .mergeMap(currentSector => {
          this.currentSector = currentSector;

          return this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters));
        })
        .subscribe(registers => {                        
          this.totalPages  = registers.pages;
          this.currentPage = registers.page;
          this.registers   = registers.data;
        })
    );
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

    this.sectorService.createRegister(register.sector, newRegister)
      .flatMap((newRegister) => {
        
        register.isResolved       = true;
        register.resolvedRegister = newRegister;
        
        return this.registerService.patch(register, [
          { op: 'add', path: '/resolvedRegister', value: register.resolvedRegister._id },
          { op: 'add', path: '/isResolved', value: true }
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
    this._getRegistersWithFilters();
  }

  toggleIncompleteFilter() {
      this.currentFilters['incomplete'] = !this.currentFilters['incomplete'];
      this._getRegistersWithFilters();
  }

  toggleDateTimeFilter(filterName: string) {    
    // for time-based filter buttons
    if(filterName === this.currentDateTimeFilterName) { 
      // means that the filter will be deactivated...      
      this.currentDateTimeFilterName = null;
      this.currentFilters['from']    = null;
      this.currentFilters['to']      = null;
    } else {
      // clear custom date filters
      this.fromDate               = null;
      this.toDate                 = null;
      this.currentFilters['from'] = null;
      this.currentFilters['to']   = null;
      
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
    
    this._getRegistersWithFilters();
  }

  setFromDateFilter(date) {
    // deactivate button-based date filters
    this.currentDateTimeFilterName = null;
    
    this.currentFilters.from = moment(date).unix() * 1000;
    this._getRegistersWithFilters();
  }
  
  setToDateFilter(date) {
    // deactivate button-based date filters
    this.currentDateTimeFilterName = null;
    
    this.currentFilters.to = moment(date).unix() * 1000;    
    this._getRegistersWithFilters();
  }
  
  
  setPersonRutFilter(rut: string) {    
    this.currentFilters.personRut = rut;
    this._getRegistersWithFilters();
  }
  
  setPersonNameFilter(personName: string) {    
    this.currentFilters.personName = personName;
    this._getRegistersWithFilters();
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
  
  goToPage(pageNum) {
    this.currentFilters["page"] = pageNum;
    
    this._getRegistersWithFilters();
  }
  
  ngOnDestroy() {
    this.activeSubscriptions.forEach(s => s.unsubscribe());
  }
  
  
  //------------------------
  //    Private methods
  //------------------------
    
  private _getRegistersWithFilters() {
    this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters))
                      .subscribe(registers => {
                        this.totalPages  = registers.pages;
                        this.currentPage = registers.page;
                        this.registers   = registers.data;
                      });
  }
  
}
