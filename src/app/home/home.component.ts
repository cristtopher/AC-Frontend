import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { User } from '../shared/user/user.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
    
  constructor(private route: ActivatedRoute) {     
  }

  ngOnInit() {
    this.currentUser = this.route.snapshot.data['currentUser'];
    
    console.log(`Home.currentUser: ${this.currentUser}`)
    
    
  }

}
