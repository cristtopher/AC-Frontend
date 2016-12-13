import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  inputs: ['username', 'password']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
    
  constructor(private authService: AuthService, private router:Router) { 
  }
  
  ngOnInit() {
  }

  login($event, email, password) {    
    this.authService.login(email, password)
                    .subscribe(() => {
                      if(this.authService.loggedIn()) { return this.router.navigate(['/home']); }
                    }, (err) => {
                      console.error(`Error while trying to login to API: ${err}`);
                    });
  }


}
