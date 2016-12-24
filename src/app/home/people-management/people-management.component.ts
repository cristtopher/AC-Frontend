import * as _ from "lodash";

import { Component, OnInit } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Overlay, overlayConfigFactory } from 'angular2-modal';


import { Person } from '../../shared/person/person.model';
import { PersonService } from '../../shared/person/person.providers';
import { SocketService } from '../../shared/socket/socket.service';


import { PersonModalComponent, PersonModalContext } from './person-modal/person-modal.component';

@Component({
  selector: 'app-people-management',
  templateUrl: './people-management.component.html',
  styleUrls: ['./people-management.component.css']
})
export class PeopleManagementComponent implements OnInit {

  visits: Person[];

  constructor(private modal: Modal, private personService: PersonService, private socketService: SocketService) {
    this.socketService.get('person')
                      .subscribe((event) => {
                        if (event.action == "save") { return this.visits.push(event.item); }
                        if (event.action == "remove") { return _.remove(this.visits, { _id: event.item._id }); }
                        // if (event.action == "update") { return _.replace(this.visits, { _id: event.item._id }, event.item); }
                      })
    
    this.personService.getVisits()
                      .subscribe(visits => this.visits = visits);
  }

  ngOnInit() {}
  
  updateVisit(visit: Person){
    this.modal
      .open(PersonModalComponent, overlayConfigFactory({ action: "update", rut: visit.rut, name: visit.name, company: visit.company }, BSModalContext))
      .then(dialog => dialog.result)
      .then(result => {
        console.log(`result: ${JSON.stringify(result)}`);
      });
  }

  deleteVisit(visit: Person){
    this.personService.deletePerson(visit)
                      .subscribe(() => _.remove(this.visits, { _id: visit._id }));
  }

  createVisit() {
    this.modal.open(PersonModalComponent, overlayConfigFactory({ action: "create" }, BSModalContext))
  }

}
