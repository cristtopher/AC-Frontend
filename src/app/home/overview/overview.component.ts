import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

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
  activeSubscriptions = [];
  
  currentUser: any;
  registers: Register[];

  currentCompany: Company;

  statistics = {
    totalPersonsInCompany: null,
    staffPercentageInCompany: null,
    contractorsPercentageInCompany: null,
    visitorsPercentageInCompany: null
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
    ],
    options: {
      scaleShowVerticalLines: false, 
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
              beginAtZero: true,
              callback: function(value) { if (value % 1 === 0) { return value; }}
          }
        }]
      }
    }
  }

  constructor(private socketService: SocketService, private userService: UserService, private sectorService: SectorService, private companyService: CompanyService) { }

  ngOnInit() {
    this.activeSubscriptions.push(
      this.socketService.get('register')
                  .filter(event => event.item.isUnauthorized)
                  .flatMap(currentCompany => this.companyService.getRegisters(this.currentCompany, { top: 15 }))
                  .do(registers => this.registers = registers)                      
                  .flatMap(() => this.companyService.getStatistics(this.currentCompany))
                  .do((statisticsData) => this.processStatisticsData(statisticsData))
                  .subscribe()
    );
    
    this.activeSubscriptions.push(
      this.userService.currentCompany
                .do(currentCompany => this.currentCompany = currentCompany)
                .flatMap(currentCompany => this.companyService.getRegisters(this.currentCompany, { top: 15 }))
                .do(registers => this.registers = registers)
                .flatMap(() => this.companyService.getStatistics(this.currentCompany))
                .do((statisticsData) => this.processStatisticsData(statisticsData))        
                .subscribe()
    );                     
  }

  processStatisticsData(statisticsData) {
    console.log(`got statisticsData: ${JSON.stringify(statisticsData)}`)
    
    this.statistics.totalPersonsInCompany          = statisticsData.staffCount + statisticsData.contractorCount + statisticsData.visitCount;
    this.statistics.staffPercentageInCompany       = this.statistics.totalPersonsInCompany ? (statisticsData.staffCount / this.statistics.totalPersonsInCompany) * 100 : 0;
    this.statistics.contractorsPercentageInCompany = this.statistics.totalPersonsInCompany ? (statisticsData.contractorCount / this.statistics.totalPersonsInCompany) * 100 : 0;
    this.statistics.visitorsPercentageInCompany    = this.statistics.totalPersonsInCompany ? (statisticsData.visitCount / this.statistics.totalPersonsInCompany) * 100 : 0;
  
    this.profileDistPieChart.data = [
      this.statistics.staffPercentageInCompany, 
      this.statistics.contractorsPercentageInCompany, 
      this.statistics.visitorsPercentageInCompany
    ];

    let reversedEntryWeeklyHistory = statisticsData.weeklyHistory.entry.reverse();
    let reversedDepartWeeklyHistory = statisticsData.weeklyHistory.depart.reverse();

    // this.registersPerWeekBarChart.labels = reversedEntryWeeklyHistory.map(t => moment.weekdays()[moment(t.datetime).day()]);
    this.registersPerWeekBarChartVC.labels = reversedEntryWeeklyHistory.map(t => moment.weekdays()[moment.unix(t.datetime / 1000).utc().day()]);
    this.registersPerWeekBarChartVC.ngOnChanges({});
    


    this.registersPerWeekBarChart.series = [
      { label: 'Entradas', data: reversedEntryWeeklyHistory.map(x => x.count) },
      { label: 'Salidas', data: reversedDepartWeeklyHistory.map(x => x.count) }
    ];
  }
  
  ngOnDestroy() {
    this.activeSubscriptions.forEach(s => s.unsubscribe());
  }
}
