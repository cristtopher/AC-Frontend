import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Rx';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext }                        from 'angular2-modal/plugins/bootstrap/index';

import { AuthService } from '../../../api/auth/auth.service';
import { PersonService } from '../../../api/person/person.providers';
import { CompanyService } from '../../../api/company/company.providers';

import { Company } from '../../../api/company/company.model';

import swal from 'sweetalert2';

export class ImportModalContext extends BSModalContext {
  company: Company
  
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
  uploader: FileUploader;
  
  constructor(public dialog: DialogRef<ImportModalContext>, private companyService: CompanyService) {
    this.context = dialog.context;
    this.context.showClose = true;
    dialog.setCloseGuard(this);
    
    this.uploader = this.companyService.getExcelUploader(this.context.company);
    
    this.uploader.onSuccessItem = (item:FileItem, response:string, status:number, headers:ParsedResponseHeaders) => {
      return swal('Importar Excel', 'Importación de personas finalizada satisfactoriamente', 'success')
        .then(() => this.closeModal());
    }
    
    this.uploader.onErrorItem = (item:FileItem, response:string, status:number, headers:ParsedResponseHeaders) => {
      return swal('Importar Excel', 'Error al intentar importar personas', 'error')
        .then(() => this.closeModal());
    }
    
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
      
      this.uploader.uploadAll();
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
