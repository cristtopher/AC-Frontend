import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { AuthService } from '../api/auth/auth.service';
import { User } from '../api/user/user.model';

declare var $: any;

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

  login($event, rut, password) {    
    this.authService.login(rut, password)
                    .flatMap(() => this.authService.getProfile())
                    .subscribe((user: User) => {
                      if(!this.authService.loggedIn()) { return; }
                      
                      if(user.role === 'admin'){ 
                        return this.router.navigate(['/admin']); 
                      } else {
                        return this.router.navigate(['/home']); 
                      }
                    }, (error) => {
                      if (error.status === 401) {
                        console.log('Invalid Username or Password!');
                      } else if (error.status === 500) {
                        console.log('Server Error while trying to login');
                      } else {
                        console.error(`Error while trying to login to API: ${error}`);
                      }
                    });
  }

  rememberMeToggle(event) {        
    console.log('remember me clicked!');
  }

}
