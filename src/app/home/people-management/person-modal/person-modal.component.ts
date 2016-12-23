import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';

export class PersonModalContext extends BSModalContext {
    constructor(public rut: string, public name: string, public company: string) {
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
  
  constructor(public dialog: DialogRef<PersonModalContext>) {
    this.context = dialog.context;
    this.context.showClose = true;
    dialog.setCloseGuard(this);

    console.log(`context = ${JSON.stringify(this.context)}`);    
  }

  ngOnInit() {
  }
    
  createPerson(){
    return new Promise<any>((resolve) => resolve("asdasd"))
    .then(() => this.dialog.close(this.context));
  }
  
  updatePerson(){
    return new Promise<any>((resolve) => resolve("asdsd"))
    .then(() => this.dialog.close(this.context));    
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
