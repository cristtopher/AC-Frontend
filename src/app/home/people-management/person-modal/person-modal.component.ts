import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Rx';

import { BSModalContext }                        from 'angular2-modal/plugins/bootstrap/index';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';

import { CompanyService }                           from '../../../api/company/company.providers';
import { PersonService, HUMANIZED_PERSON_PROFILES } from '../../../api/person/person.providers';

import { Person } from '../../../api/person/person.model';
import { Company } from '../../../api/company/company.model';

export class PersonModalContext extends BSModalContext {
    constructor(public person: Person, public company: Company) {
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
  personExistsErrorMsg = false;
  
  constructor(public dialog: DialogRef<PersonModalContext>, private personService: PersonService, private companyService: CompanyService) {
    this.context = dialog.context;
    this.context.showClose = true;
    dialog.setCloseGuard(this);
  }

  ngOnInit() { }
    
  createPerson(){
    return this.companyService.createPerson(this.context.company, this.context.person)                         
                             .toPromise()
                             .then((person) => this.dialog.close(person))
                             .catch((error) => {
                               if(error.code === 11000) {
                                 this.personExistsErrorMsg = true;
                                 return;
                               }
                             })     
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
