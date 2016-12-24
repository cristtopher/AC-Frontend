import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Person } from '../../shared/person/person.model';
import { PersonService } from '../../shared/person/person.providers';
// import { Register } from '../../shared/register/register.model';
// import { RegisterService } from '../../shared/person/person.model';

import { SocketService } from '../../shared/socket/socket.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  registers: any;
  
  pieChart1 = {
    labels: ['A', 'B', 'C'],
    data: [300, 500, 100]
  }
  
  pieChart2 = {
    labels: ['Planta', 'Contratistas', 'Visitas'],
    data: [200, 100, 300]
  }
    
  barChart = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    series: [
      {label: 'Series A', data: [65, 59, 80, 81, 56, 55, 40]},
      {label: 'Series B', data: [28, 48, 40, 19, 86, 27, 90]}
    ]
  }
  
  constructor(private route: ActivatedRoute, private personService: PersonService, private socketService: SocketService) {
    this.socketService.get('register')
                      .subscribe((event) => {
                        if (event.action == "save")   { return  }
                        if (event.action == "remove") { return  }
                      });
  }

  ngOnInit() {
    
  }
  
  
}
