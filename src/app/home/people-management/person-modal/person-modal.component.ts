import { Observable } from 'rxjs/Rx';

import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';

import { Person } from '../../../shared/person/person.model';
import { PersonService } from '../../../shared/person/person.providers';


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
  
  constructor(public dialog: DialogRef<PersonModalContext>, private personService: PersonService) {
    this.context = dialog.context;
    this.context.showClose = true;
    dialog.setCloseGuard(this);
  }

  ngOnInit() { }
    
  createPerson(){
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
