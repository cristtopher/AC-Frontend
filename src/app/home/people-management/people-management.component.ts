import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Overlay, overlayConfigFactory } from 'angular2-modal';

import { Person } from '../../api/person/person.model';
import { PersonService } from '../../api/person/person.providers';
import { SocketService } from '../../api/socket/socket.service';

import { PersonModalComponent, PersonModalContext } from './person-modal/person-modal.component';

@Component({
  selector: 'app-people-management',
  templateUrl: './people-management.component.html',
  styleUrls: ['./people-management.component.css']
})
export class PeopleManagementComponent implements OnInit {
  visits: Person[];

  constructor(private modal: Modal, private personService: PersonService, private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.get('person')
                      .subscribe((event) => {
                        if (event.action == "save") { return this.visits.push(event.item); }
                        if (event.action == "remove") { return _.remove(this.visits, { _id: event.item._id }); }
                        if (event.action == "update") { 
                          let idx = _.indexOf(this.visits, _.find(this.visits, { _id: event.item._id }));
                          return this.visits.splice(idx, 1, event.item);
                        }
                      });
    
    this.personService.getVisits()
                      .subscribe(visits => this.visits = visits);
  }
  
  updateVisit(visit: Person){
    this.modal.open(PersonModalComponent, overlayConfigFactory({ action: "update", person: new Person().clone(visit) }, BSModalContext));
  }

  deleteVisit(visit: Person){
    this.personService.deletePerson(visit).subscribe();
  }

  createVisit() {
    this.modal.open(PersonModalComponent, overlayConfigFactory({ action: "create", person: new Person() }, BSModalContext));
  }

}
