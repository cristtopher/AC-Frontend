import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../shared/user/user.model';
import { AuthService } from '../../shared/auth/auth.service';

declare var $: any;

@Component({
  selector: 'home-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.css']
})
export class TopHeaderComponent implements OnInit {
  currentUser: User;
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.currentUser = this.route.snapshot.data['currentUser'];
    
    console.log(`TopHeaderComponent.currentUser: ${this.currentUser.name}`);
  }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

  toggleSidebar() {
    if ($(window).width() < 769) {
        $('body').toggleClass('sidebar-open-sm');
    } else {
        $('body').toggleClass('sidebar-closed-md');
    }
  }
}
