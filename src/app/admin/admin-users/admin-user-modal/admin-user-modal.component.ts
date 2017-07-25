import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Rx';

import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';

import { CompanyService } from '../../../api/company/company.providers';
import { UserService, HUMANIZED_USER_ROLES } from '../../../api/user/user.providers';

import { User } from '../../../api/user/user.model';
import { Company } from '../../../api/company/company.model';

export class AdminUserModalContext extends BSModalContext {
    action: string;
    password: string;
    
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
                             .then(user => {
                               if(this.context.password) {
                                 return this.userService.changePassword(user, this.context.password)
                                   .toPromise()
                                   .then(() => user);
                               }
       
                               return user;
                             })
                             .then(user => this.dialog.close(user))
                             .catch(error => {
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
    let user = this.context.user;
    
    return this.userService.patchUser(user, [
        { op: 'add', path: '/rut', value: user.rut },
        { op: 'add', path: '/name', value: user.name },
        { op: 'add', path: '/role', value: user.role },
        { op: 'add', path: '/companies', value: user.companies.map(c => c._id) }
      ])
     .toPromise()
     .then(user => {
       if(this.context.password) {
         return this.userService.changePassword(user, this.context.password)
           .toPromise()
           .then(() => user);
       }
       
       return user;
     })
     .then(user => this.dialog.close(user))
     .catch(error => {
       if(error.code === 11000) {
         this.userExists = true;
         return;
       }

       if (error.errors) {
         this.fieldErrorMsg = true;

       }
     });
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
