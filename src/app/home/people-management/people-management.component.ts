import * as _ from 'lodash';

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { RoutePaginator } from 'ngx-paginator';

import { PersonService, HUMANIZED_PERSON_PROFILES } from '../../api/person/person.providers';
import { UserService } from '../../api/user/user.providers';
import { CompanyService } from '../../api/company/company.providers';
import { SocketService } from '../../api/socket/socket.service';

import { Company }  from '../../api/company/company.model';
import { Person }  from '../../api/person/person.model';

import { PersonModalComponent, PersonModalContext } from './person-modal/person-modal.component';
import { ImportModalComponent, ImportModalContext } from './import-modal/import-modal.component';

import swal from 'sweetalert2';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-people-management',
  templateUrl: './people-management.component.html',
  styleUrls: ['./people-management.component.css']
})
export class PeopleManagementComponent implements OnInit, OnDestroy {
  activeSubscriptions = [];
  
  currentCompany: Company;
  persons: Person[];

  humanizedPersonProfiles = HUMANIZED_PERSON_PROFILES;

  // paging 
  @ViewChild(RoutePaginator) routePaginator: RoutePaginator;
  totalPages  = 1;
  currentPage = 1;

  // filtering
  currentProfileFilterControl: string = "";
  currentStatusFilterControl: string = "";
  
  currentFilters = {
    paging: true,
    page: 1,
    personType: null,
    rut: null,
    name: null,
    status: null
  };
  
  constructor(private modal: Modal, 
              private userService: UserService,
              private companyService: CompanyService,
              private personService: PersonService, 
              private socketService: SocketService) { }

  ngOnInit() {
    this.activeSubscriptions.push(
      this.socketService.get('person')
        .flatMap(() => this.companyService.getPersons(this.currentCompany, _.pickBy(this.currentFilters, o => !_.isNil(o))))
        .subscribe(personsData => {
          this.totalPages  = personsData.pages;
          this.currentPage = personsData.page;
          this.persons     = personsData.data;
        })
    );

    this.activeSubscriptions.push(
      this.userService.currentCompany
        .do(currentCompany => this.currentCompany = currentCompany)
        .flatMap(currentCompany => this.companyService.getPersons(this.currentCompany, _.pickBy(this.currentFilters, o => !_.isNil(o))))
        .subscribe(personsData => {
          this.totalPages  = personsData.pages;
          this.currentPage = personsData.page;
          this.persons     = personsData.data;
        })
    )
  }
  
  ngOnDestroy() {
    this.activeSubscriptions.forEach(s => s.unsubscribe());
  }
  
  // -------------------------
  //     CRUD operations
  // -------------------------
  
  updatePerson(person: Person) {
    this.modal.open(PersonModalComponent, overlayConfigFactory({ action: "update", person: new Person().clone(person) }, BSModalContext));
  }

  deletePerson(person: Person){
    swal({
      title: 'Eliminar Persona?',
      html: `Estas seguro de eliminar a <strong>${person.name}</strong>?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    })
    .then(() => {
      if (this.persons.length == 1 && this.currentFilters.page > 1) { this.currentFilters.page--; }
      
      this.personService.deletePerson(person)
        .subscribe(() => {
          swal('Eliminar Persona', `${person.name} eliminada satisfactoriamente`, 'success');
        });
    }, (dismiss) => {});
  }

  createPerson() {
    this.modal.open(PersonModalComponent, overlayConfigFactory({ action: "create", person: new Person(), company: this.currentCompany }, BSModalContext));
  }
  
  // -------------------------
  //      Import/Export
  // -------------------------
  importExcel() {
    this.modal.open(ImportModalComponent, overlayConfigFactory({ company: this.currentCompany }, BSModalContext));
  }
   
  exportExcel() { 
    this.companyService.exportExcel(this.currentCompany)
      .subscribe(data  => fileSaver.saveAs(data, 'people-export.xlsx'),
                 error => console.log("Error downloading the file."),
                 ()    => console.log('Completed file download.'));
  }
  
  // -------------------------
  //        Paging
  // -------------------------
  
  
  goToPage(pageNum) {
    this.currentFilters.page                  = pageNum;
    this.routePaginator.paginator.currentPage = pageNum;
    
    this.companyService.getPersons(this.currentCompany, _.pickBy(this.currentFilters, o => !_.isNil(o)))
                      .subscribe(personsData => {
                        this.totalPages  = personsData.pages;
                        this.currentPage = personsData.page;
                        this.persons     = personsData.data;
                      });
    
  }


  // -------------------------
  //        Filtering
  // -------------------------
    
  changeProfileFilter(profile: string) {
    this.currentFilters.personType = profile;
    this.routePaginator.changePage(1);
  }

  changeStatusFilter(status: string) {  
    this.currentFilters.status = status ? JSON.parse(status) : null;    
    this.routePaginator.changePage(1);
  }
  
  changeRutFilter(rut: string) {
    this.currentFilters.rut = rut;    
    this.routePaginator.changePage(1);
  }
  
  changeNameFilter(name: string) {
    this.currentFilters.name = name;
    this.routePaginator.changePage(1);
  }
  
}
