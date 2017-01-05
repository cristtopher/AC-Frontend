import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Register } from '../../api/register/register.model';
import { RegisterService } from '../../api/register/register.providers';

import { Sector } from '../../api/sector/sector.model';
import { SectorService } from '../../api/sector/sector.providers';

import { SocketService } from '../../api/socket/socket.service';

import * as _ from 'lodash';
import * as moment from 'moment';

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
    data: [0, 0, 0]
  }
    
  registersPerWeekBarChart = {
    labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
    series: [
      {label: 'Entradas', data: [0, 0, 0, 0, 0, 0, 0]},
      {label: 'Salidas', data: [0, 0, 0, 0, 0, 0, 0]}
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
    this.sectorService.getStatistics(this.currentSector).subscribe(statistics => {
      console.log(`got statistics: ${JSON.stringify(statistics)}`)
      
      this.statistics.totalRegisters        = statistics.staffCount + statistics.contractorCount + statistics.visitCount;
      this.statistics.staffPercentage       = this.statistics.totalRegisters ? (statistics.staffCount / this.statistics.totalRegisters) * 100 : 0;
      this.statistics.contractorsPercentage = this.statistics.totalRegisters ? (statistics.visitCount / this.statistics.totalRegisters) * 100 : 0;
      this.statistics.visitorsPercentage    = this.statistics.totalRegisters ? (statistics.visitCount / this.statistics.totalRegisters) * 100 : 0;
    
      this.profileDistPieChart.data = [this.statistics.staffPercentage, this.statistics.visitorsPercentage, this.statistics.visitorsPercentage];
      
      this.registersPerWeekBarChart.labels = statistics.weeklyHistory.entry.reverse().map(t => moment.weekdays()[moment(t.datetime).day()]);
      
      this.registersPerWeekBarChart.series = [
        { label: 'Entradas', data: [Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100)] },
        { label: 'Salidas', data: [Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100)] }
      ];
    });
  }
}
