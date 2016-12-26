import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Register } from '../../shared/register/register.model';
import { RegisterService } from '../../shared/register/register.providers';

import { SocketService } from '../../shared/socket/socket.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  registers: Register[];
  
  statistics = {
    totalRegisters: null,
    employeesPercentage: null,
    contractorsPercentage: null,
    visitorsPercentage: null
  }
  
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
      {label: 'Entradas', data: [65, 59, 80, 81, 56, 55, 40]},
      {label: 'Salidas', data: [28, 48, 40, 19, 86, 27, 90]}
    ]
  }
  
  constructor(private route: ActivatedRoute, private registerService: RegisterService, private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.get('register')
                      .subscribe((event) => {
                        if (event.action == "save")   { this.registers.push(event.item); }
                        else if (event.action == "remove") {  _.remove(this.registers, { _id: event.item._id }); }
                        
                        this.recalculateStatistics();
                      });
                  
    this.registerService.get().subscribe(registers => {
      this.registers = registers;
      this.recalculateStatistics();
    });
  }
  
  recalculateStatistics() {
    this.statistics.totalRegisters = this.registers.length;
    this.statistics.contractorsPercentage = 0.3 * this.registers.length;
    this.statistics.employeesPercentage = 0.6 * this.registers.length;
    this.statistics.visitorsPercentage = 0.1 * this.registers.length;
  }
}
