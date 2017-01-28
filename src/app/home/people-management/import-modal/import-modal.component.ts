import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Rx';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext }                        from 'angular2-modal/plugins/bootstrap/index';

import { PersonService, HUMANIZED_PERSON_PROFILES } from '../../../api/person/person.providers';

import swal from 'sweetalert2';

export class ImportModalContext extends BSModalContext {
    constructor() {
      super();
    }
}

@Component({
  selector: 'people-management-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.css']
})
export class ImportModalComponent implements OnInit, ModalComponent<ImportModalContext> {
  context: ImportModalContext;
  
  constructor(public dialog: DialogRef<ImportModalContext>) {
    this.context = dialog.context;
    this.context.showClose = true;
    dialog.setCloseGuard(this);
  }

  ngOnInit() { }

  importExcel() {
    swal({
      title: 'Importar Excel',
      text: 'La importación reemplazará todos los usuarios existentes. Estas seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Importar',
      cancelButtonText: 'Cancelar'
    })
    .then(() => {
      console.log('Importing excel...');
      
      return swal('Importar Excel', 'Importación de personas finalizada satisfactoriamente', 'success')
        .then(() => this.closeModal());
    }, (dismiss) => {});
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
