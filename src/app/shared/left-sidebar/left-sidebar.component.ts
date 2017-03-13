import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { UserService } from '../../api/user/user.providers';
import { User } from '../../api/user/user.model';

import { Company } from '../../api/company/company.model';
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
  currentCompany: Company
  currentSector: Sector;

  currentCompanyId: string;
  currentSectorId: string;
  
  isMultiCompany: boolean = false;
  
  companies: Company[];
  sectors: Sector[];
  
  constructor(private userService: UserService) { }

  ngOnInit() { 
    
    this.userService.getMyCompanies()
      .map(companies => _.sortBy(companies, 'name'))
      .subscribe((companies: Company[]) => {
        if (companies.length > 1) {
          this.isMultiCompany = true;
        }

        this.companies = companies;

        this.userService.getMySectors(companies[0])
          .map(sectors => _.sortBy(sectors, 'name'))
          .subscribe((sectors: Sector[]) => {
            this.sectors = sectors;
          });
      });
        
    this.userService.currentUser.subscribe(currentUser => this.currentUser = currentUser);
    
    this.userService.currentCompany
      .filter(c => c != null)
      .subscribe(currentCompany => {
          this.currentCompany   = currentCompany;
          this.currentCompanyId = currentCompany._id;
      });
    
    this.userService.currentSector
      .filter(s => s != null)
      .subscribe(currentSector => {          
          this.currentSector   = currentSector;
          this.currentSectorId = currentSector._id;
      });
  }
  
  changeCompany(companyId: string) {
    let newCompany = _.find(this.companies, c => c._id === companyId);    
    this.userService.setCurrentCompany(newCompany);
    
    this.userService.getMySectors(newCompany)
      .map(sectors => _.sortBy(sectors, 'name'))
      .subscribe((sectors: Sector[]) => {
        this.sectors = sectors;
        this.userService.setCurrentSector(sectors[0]);
      });
  }
  
  changeSector(sectorId: string) {
    let newSector = _.find(this.sectors, s => s._id === sectorId);
    this.userService.setCurrentSector(newSector);
  }
}
