import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

import { RegisterService } from '../../api/register/register.providers';
import { SectorService } from '../../api/sector/sector.providers';
import { UserService } from '../../api/user/user.providers';
import { SocketService } from '../../api/socket/socket.service';

import { Sector } from '../../api/sector/sector.model';
import { Register } from '../../api/register/register.model';

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
    staffCount: null,
    contractorCount: null,
    visitCount: null,
    contractorsPercentage: null,
    visitorsPercentage: null
  }

  profileDistPieChart = {
    labels: ['Empleados', 'Contratistas', 'Visitas'],
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

  @ViewChild('registersPerWeekBarChartComponent') registersPerWeekBarChartVC: BaseChartDirective;
  
  registersPerWeekBarChart = {
    labels: [],
    series: [
      {label: 'Entradas', data: []},
      {label: 'Salidas', data: []}
    ]
  }

  constructor(private socketService: SocketService, private userService: UserService, private sectorService: SectorService) { }

  ngOnInit() {
    this.socketService.get('register')
                      .filter(event => event.item.isUnauthorized)
                      .filter(event => event.item.sector !== this.currentSector._id)
                      .flatMap(() => this.sectorService.getRegisters(this.currentSector, { top: 15 }))
                      .do(registers => this.registers = registers)
                      .flatMap(() => this.sectorService.getStatistics(this.currentSector))
                      .do(statisticsData => this.processStatisticsData(statisticsData))
                      .subscribe();


    this.userService.currentSector
                      .filter(s => s != null)
                      .do(currentSector => this.currentSector = currentSector)
                      .flatMap(currentSector => this.sectorService.getRegisters(this.currentSector, { top: 15 }))
                      .do(registers => this.registers = registers)
                      .flatMap(() => this.sectorService.getStatistics(this.currentSector))
                      .do(statisticsData => this.processStatisticsData(statisticsData))
                      .subscribe();
  }

  processStatisticsData(statistics) {
    console.log(`recalculating statistics from: ${JSON.stringify(statistics)}`)

    this.statistics.totalRegisters        = statistics.staffCount + statistics.contractorCount + statistics.visitCount;
    this.statistics.staffCount            = statistics.staffCount;
    this.statistics.contractorCount       = statistics.contractorCount;
    this.statistics.visitCount            = statistics.visitCount;
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
    
    this.registersPerWeekBarChartVC.labels = reversedEntryWeeklyHistory.map(t => moment.weekdays()[moment(t.datetime).day()]);;
    this.registersPerWeekBarChartVC.ngOnChanges({});

    this.registersPerWeekBarChart.series = [
      { label: 'Entradas', data: reversedEntryWeeklyHistory.map(x => x.count) },
      { label: 'Salidas', data: reversedDepartWeeklyHistory.map(x => x.count) }
    ];
  }
}
