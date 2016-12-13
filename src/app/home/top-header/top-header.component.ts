import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'home-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.css'],
  inputs: ['currentUser']
})
export class TopHeaderComponent implements OnInit {
  
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

}
