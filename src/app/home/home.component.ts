import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/auth/auth.service';

import { User } from '../shared/user/user.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  
  constructor(private authService: AuthService) { 
    this.authService.getProfile().subscribe( user => this.currentUser);
  }

  ngOnInit() {
    console.log('Using home component');    
  }

}
