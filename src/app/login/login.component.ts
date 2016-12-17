import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/user/user.model';

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

  login($event, email, password) {    
    this.authService.login(email, password)
                    .flatMap(() => this.authService.getProfile())
                    .subscribe((user: User) => {
                      if(!this.authService.loggedIn()) { return; }
                      
                      if(user.role === 'admin'){ 
                        return this.router.navigate(['/admin']); 
                      } else {
                        return this.router.navigate(['/home']); 
                      }
                    }, (err) => {
                      console.error(`Error while trying to login to API: ${err}`);
                    });
  }

  rememberMeToggle(event) {        
    console.log('remember me clicked!');
  }

}
