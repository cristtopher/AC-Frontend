import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../api/user/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  currentUser: User;
  
  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.currentUser = this.route.snapshot.data['currentUser'];
    
    if (this.currentUser.role !== 'admin') {
      this.router.navigate(['/home']);
    }
  }

}
