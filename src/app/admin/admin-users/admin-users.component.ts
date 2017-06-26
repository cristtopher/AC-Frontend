import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { UserService } from '../../api/user/user.providers';
import { User } from '../../api/user/user.model';

import swal from 'sweetalert2';

@Component({
  selector: 'admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  users$: Observable<User[]>;
  
  // paging
  totalPages = 10;
  currentPage = 1;
  usersInPage = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users$ = this.userService.get({ paging: 1, populate: 1 })
      .map(data => {
        this.totalPages  = data.pages;
        this.currentPage = data.page;
        this.usersInPage = data.users.length;
        
        return data.users
      });
  }


  deleteUser(user: User){
    swal({
      title: 'Eliminar Usuario?',
      html: `Estas seguro de eliminar a <strong>${user.name}</strong>?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    })
    .then(() => {
      if (this.usersInPage == 1 && this.currentPage > 1) { this.currentPage--; }
      
      this.userService.deleteUser(user)
        .subscribe(() => {
          this.goToPage(this.currentPage)
          swal('Eliminar Usuario', `${user.name} eliminada satisfactoriamente`, 'success');
        });
    }, (dismiss) => {});
  }
  

  goToPage(pageNum) {
    this.users$ = this.userService.get({ paging: 1, page: pageNum, populate: 1 })
      .map(data => {
        this.totalPages  = data.pages;
        this.currentPage = data.page;
        this.usersInPage = data.users.length;
        
        return data.users
      })
  }

}
