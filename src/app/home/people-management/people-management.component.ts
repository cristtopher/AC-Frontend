import { Component, OnInit } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Overlay, overlayConfigFactory } from 'angular2-modal';

import { PersonService } from '../../shared/person/person.providers';

import { PersonModalComponent, PersonModalContext } from './person-modal/person-modal.component';

@Component({
  selector: 'app-people-management',
  templateUrl: './people-management.component.html',
  styleUrls: ['./people-management.component.css']
})
export class PeopleManagementComponent implements OnInit {

  visits: any = [{
    name: 'John doe',
    rut: '123456-7',
    company: 'company 1'
  }];

  constructor(public modal: Modal, public personService: PersonService) {
    this.personService.getVisits()
    .subscribe((visits) => {
      this.visits = visits;
    });
  }

  ngOnInit() {}
  
  updateVisit(visit: any){
    console.log(`visit: ${visit}`)
    this.modal.open(PersonModalComponent, overlayConfigFactory({ action: "update", rut: visit.rut, name: visit.name, company: visit.company }, BSModalContext))
    .then(dialog => dialog.result)
    .then(result => {
      console.log(`result: ${result}`);
    });
  }

  deleteVisit(visit: any){
    // todo...
  }

  createVisit() {
    this.modal.open(PersonModalComponent, overlayConfigFactory({ action: "create" }, BSModalContext))
    .then(dialog => dialog.result)
    .then(result => {
      if(!result) { return; }
      
      this.visits.push({ name: "", rut: "ctx.rut", company: "ctx.company" });
    });
  }

}
