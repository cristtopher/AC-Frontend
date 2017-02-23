import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Rx';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext }                        from 'angular2-modal/plugins/bootstrap/index';

import { Person }                                   from '../../../api/person/person.model';
import { PersonService, HUMANIZED_PERSON_PROFILES } from '../../../api/person/person.providers';


export class PersonModalContext extends BSModalContext {
    constructor(public person: Person) {
      super();
    }
}

@Component({
  selector: 'people-management-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.css']
})
export class PersonModalComponent implements OnInit, ModalComponent<PersonModalContext> {
  context: PersonModalContext;
  
  humanizedPersonProfiles = HUMANIZED_PERSON_PROFILES;
  
  constructor(public dialog: DialogRef<PersonModalContext>, private personService: PersonService) {
    this.context = dialog.context;
    this.context.showClose = true;
    dialog.setCloseGuard(this);
  }

  ngOnInit() { }
    
  createPerson(){
    //this.context.person.card = Number(this.context.person.rut.split("-")[0])
    return this.personService.createPerson(this.context.person)
                             .toPromise()
                             .then((person) => this.dialog.close(person))
  }
  
  updatePerson(){
    return this.personService.updatePerson(this.context.person)
                             .toPromise()
                             .then((person) => this.dialog.close(person))
   }
  
  closeModal() {
    return this.dialog.close();
  }
  
  onKeyUp(value) {
  }

  beforeDismiss(): boolean {
    return true;
  }

  beforeClose(): boolean {
    return false;
  }
}
