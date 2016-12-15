import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/user/user.model';


@Component({
  selector: 'home-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  @Input() currentUser: User;
  
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.currentUser = this.route.snapshot.data['currentUser'];
  }


}
