import { Component, OnInit } from '@angular/core';

import { UserService } from '../../shared/user/user.providers';

@Component({
  selector: 'admin-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {

  constructor(private userService: UserService) {  }

  ngOnInit() {
  }

}
