import { Component, OnInit } from '@angular/core';

import { UserService }     from '../../api/user/user.providers';
import { RegisterService } from '../../api/register/register.providers';
import { SectorService }   from '../../api/sector/sector.providers';
import { SocketService }   from '../../api/socket/socket.service';

import { Sector }   from '../../api/sector/sector.model';
import { Register } from '../../api/register/register.model';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-unauthorized-list',
  templateUrl: './unauthorized-list.component.html',
  styleUrls: ['./unauthorized-list.component.css']
})
export class UnauthorizedListComponent implements OnInit {  
  currentSector: Sector;

  registers: Register[] = [];
  totalPages  = 1;
  currentPage = 1;
  
  currentFilters = {
    unauthorized: true,
    paging: true,
    page: 1
  };
      
  constructor(private socketService: SocketService, 
              private userService: UserService, 
              private sectorService: SectorService, 
              private registerService: RegisterService) { }

  ngOnInit() {

    this.socketService.get('register').subscribe((event) => {                        
       // TODO: Replace this by just appending/removing new event instead of requesting all data
      if (!event.item.isUnauthorized) { return; }
      
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
                        this.totalPages  = registers.pages;
                        this.currentPage = registers.page;
                        this.registers   = registers.data;
                      });
  }

  //-------------------------
  //    Paging Handling
  //-------------------------
  
  goToPage(pageNum) {
    this.currentFilters["page"] = pageNum;
    
    this.sectorService.getRegisters(this.currentSector, _.pickBy(this.currentFilters))
                      .subscribe(registers => {
                        this.totalPages  = registers.pages;
                        this.currentPage = registers.page;
                        this.registers   = registers.data;
                      });
    
  }
}
