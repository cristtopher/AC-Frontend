import * as _ from 'lodash';

import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Register } from '../../api/register/register.model';
import { RegisterService } from '../../api/register/register.providers';

import { Sector } from '../../api/sector/sector.model';
import { SectorService } from '../../api/sector/sector.providers';

import { SocketService } from '../../api/socket/socket.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {  
  currentUser: any;
  registers: Register[];
  
  currentSector: Sector;
  
  statistics = {
    totalRegisters: null,
    staffPercentage: null,
    contractorsPercentage: null,
    visitorsPercentage: null
  }

  profileDistPieChart = {
    labels: ['Planta', 'Contratistas', 'Visitas'],
    data: [200, 100, 300]
  }
    
  registersPerWeekBarChart = {
    labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
    series: [
      {label: 'Entradas', data: [65, 59, 80, 81, 56, 55, 40]},
      {label: 'Salidas', data: [28, 48, 40, 19, 86, 27, 90]}
    ]
  }
  
  constructor(private socketService: SocketService, private sectorService: SectorService) { }

  ngOnInit() {
    this.socketService.get('register')
                      .subscribe((event) => {
                        if (event.action == "save")   { this.registers.push(event.item); }
                        else if (event.action == "remove") {  _.remove(this.registers, { _id: event.item._id }); }
                        
                        this.recalculateStatistics();
                      });
      
    this.sectorService.currentSector
                      .switchMap(currentSector => {
                        this.currentSector = currentSector;
                        return this.sectorService.getRegisters(this.currentSector, { top: 15 })
                      })
                      .subscribe(registers => {
                        this.registers = registers;
                        this.recalculateStatistics();
                      });

                      
    
  }
  
  recalculateStatistics() {
    // TODO: dummy data ATM, connect to backend
    this.statistics.totalRegisters = Math.floor(Math.random() * 100);
    this.statistics.contractorsPercentage = 0.3 * this.statistics.totalRegisters;
    this.statistics.staffPercentage = 0.6 * this.statistics.totalRegisters;
    this.statistics.visitorsPercentage = 0.1 * this.statistics.totalRegisters;
    
    this.profileDistPieChart.data = [this.statistics.staffPercentage, this.statistics.visitorsPercentage, this.statistics.visitorsPercentage];
    this.registersPerWeekBarChart.series = [
      { label: 'Entradas', data: [Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100)] },
      { label: 'Salidas', data: [Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100)] }
    ];
    
  }
}
