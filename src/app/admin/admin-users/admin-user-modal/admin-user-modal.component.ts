import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Rx';

import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';

import { CompanyService } from '../../../api/company/company.providers';
import { UserService, HUMANIZED_USER_ROLES } from '../../../api/user/user.providers';

import { User } from '../../../api/user/user.model';
import { Company } from '../../../api/company/company.model';

export class AdminUserModalContext extends BSModalContext {
    action: String;

    constructor(public user: User) {
      super();
    }
}

@Component({
  selector: 'admin-user-modal',
  templateUrl: './admin-user-modal.component.html',
  styleUrls: ['./admin-user-modal.component.css']
})
export class AdminUserModalComponent implements OnInit, ModalComponent<AdminUserModalContext> {
  context: AdminUserModalContext;
  
  humanizedUserRoles = HUMANIZED_USER_ROLES;
  
  allCompanies: Company[];
  
  // Errorvalidation
  userExists: boolean = false;
  fieldErrorMsg: boolean = false;
  
  constructor(public dialog: DialogRef<AdminUserModalContext>, private userService: UserService, private companyService: CompanyService) {
    this.context = dialog.context;
    this.context.showClose = true;
    dialog.setCloseGuard(this);        
  }

  ngOnInit() {    
    this.companyService.get().subscribe(companies => this.allCompanies = companies);
  }

  createUser() {
    let newUser = this.context.user;
    let userCompaniesId = newUser.companies.map(c => c._id);

    return this.userService.createUser(this.context.user)
                             .toPromise()
                             .then((person) => this.dialog.close(person))
                             .catch((error) => {
                               if(error.code === 11000) {
                                 this.userExists = true;
                                 return;
                               }

                               if (error.errors) {
                                 this.fieldErrorMsg = true;
                                 // Object.keys(error.errors).forEach(e => this.formFieldErrorMapping[e] = true);
                               }
                             });
  }

  updateUser(){
    console.log(this.context.user);
    
    // return this.personService.updatePerson(this.context.person)
    //                          .toPromise()
    //                          .then((person) => this.dialog.close(person))
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
