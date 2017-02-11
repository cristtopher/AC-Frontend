import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RegisterService } from '../../api/register/register.providers';
import { SectorService } from '../../api/sector/sector.providers';
import { CompanyService } from '../../api/company/company.providers';
import { UserService } from '../../api/user/user.providers';
import { SocketService } from '../../api/socket/socket.service';

import { Sector } from '../../api/sector/sector.model';
import { Company } from '../../api/company/company.model';
import { Register } from '../../api/register/register.model';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {  
  currentUser: any;
  registers: Register[];
  
  currentSector: Sector;
  currentCompany: Company;
  
  statistics = {
    totalRegisters: null,
    staffPercentage: null,
    contractorsPercentage: null,
    visitorsPercentage: null
  }

  profileDistPieChart = {
    labels: ['Planta', 'Contratistas', 'Visitas'],
    data: [0, 0, 0],
    options: {
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {            
            //get the concerned dataset
            let dataset = data.datasets[tooltipItem.datasetIndex];
          
            //get the current items value
            let currentValue = dataset.data[tooltipItem.index];
            let currentLabel = data.labels[tooltipItem.index];
            
            return `${currentLabel}: ${currentValue}%`;
          }
        }
      } 
    }
  }
    
  registersPerWeekBarChart = {
    labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
    series: [
      {label: 'Entradas', data: [0, 0, 0, 0, 0, 0, 0]},
      {label: 'Salidas', data: [0, 0, 0, 0, 0, 0, 0]}
    ]
  }
  
  constructor(private socketService: SocketService, private userService: UserService, private sectorService: SectorService, private companyService: CompanyService) { }

  ngOnInit() {
    this.socketService.get('register')
                      .subscribe((event) => {
                        if (event.item.sector._id !== this.currentSector._id) return;
                        
                        if (event.action == "save")   { this.registers.unshift(event.item); this.registers = this.registers.slice(0, 15); }
                        else if (event.action == "remove") {  _.remove(this.registers, { _id: event.item._id }); }
                        
                        this.recalculateStatistics();
                      });
      
    this.userService.currentSector
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
    //this.sectorService.getStatistics(this.currentSector).subscribe(statistics => {
    this.companyService.getStatistics(this.currentSector).subscribe(statistics => {
      console.log(`got statistics: ${JSON.stringify(statistics)}`)
      
      this.statistics.totalRegisters        = statistics.staffCount + statistics.contractorCount + statistics.visitCount;
      this.statistics.staffPercentage       = this.statistics.totalRegisters ? (statistics.staffCount / this.statistics.totalRegisters) * 100 : 0;
      this.statistics.contractorsPercentage = this.statistics.totalRegisters ? (statistics.contractorCount / this.statistics.totalRegisters) * 100 : 0;
      this.statistics.visitorsPercentage    = this.statistics.totalRegisters ? (statistics.visitCount / this.statistics.totalRegisters) * 100 : 0;
    
      this.profileDistPieChart.data = [
        this.statistics.staffPercentage, 
        this.statistics.contractorsPercentage, 
        this.statistics.visitorsPercentage
      ];
      
      let reversedEntryWeeklyHistory = statistics.weeklyHistory.entry.reverse();
      let reversedDepartWeeklyHistory = statistics.weeklyHistory.depart.reverse();
      
      this.registersPerWeekBarChart.labels = reversedEntryWeeklyHistory.map(t => moment.weekdays()[moment(t.datetime).day()]);
            
      this.registersPerWeekBarChart.series = [
        { label: 'Entradas', data: reversedEntryWeeklyHistory.map(x => x.count) },
        { label: 'Salidas', data: reversedDepartWeeklyHistory.map(x => x.count) }
      ];
      
    });
  }
}
