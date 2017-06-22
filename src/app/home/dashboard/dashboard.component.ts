import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
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

function rgba(colour:Array<number>, alpha:number):string {
  return 'rgba(' + colour.concat(alpha).join(',') + ')';
}

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeSubscriptions = [];
  
  currentUser: any;
  
  registers: Register[];
  
  widgetTableRegisters: Register[];
  widgetTableCurrentPage = 1;
  widgetTableTotalPages  = 1;


  currentSector: Sector;

  statistics = {
    totalPersonsInSector: null,
    staffPercentageInSector: null,
    contractorsPercentageInSector: null,
    visitorsPercentageInSector: null
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

  
  // widget table details
  widgetTableVisible = false;
  currentWidgetTable = null;

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
    this.activeSubscriptions.push(
      this.socketService.get('register')
        .filter(event => event.item.isUnauthorized)
        .filter(event => event.item.sector !== this.currentSector._id)
        .flatMap(() => this.sectorService.getRegisters(this.currentSector, { top: 15 }))
        .do(registers => this.registers = registers)
        .flatMap(() => this.sectorService.getStatistics(this.currentSector))
        .do(statisticsData => this.processStatisticsData(statisticsData))
        .subscribe()      
    );

    this.activeSubscriptions.push(
      this.userService.currentSector
        .filter(s => s != null)
        .do(currentSector => this.currentSector = currentSector)
        .flatMap(currentSector => this.sectorService.getRegisters(this.currentSector, { top: 15 }))
        .do(registers => this.registers = registers)
        .flatMap(() => this.sectorService.getStatistics(this.currentSector))
        .do(statisticsData => this.processStatisticsData(statisticsData))
        .do(() => this.currentWidgetTable = null)
        .subscribe()
    );
  }

  processStatisticsData(statistics) {
    console.log(`recalculating statistics from: ${JSON.stringify(statistics)}`)
    
    this.statistics.totalPersonsInSector          = statistics.staffCount + statistics.contractorCount + statistics.visitCount;
    this.statistics.staffPercentageInSector       = this.statistics.totalPersonsInSector ? (statistics.staffCount / this.statistics.totalPersonsInSector) * 100 : 0;
    this.statistics.contractorsPercentageInSector = this.statistics.totalPersonsInSector ? (statistics.contractorCount / this.statistics.totalPersonsInSector) * 100 : 0;
    this.statistics.visitorsPercentageInSector    = this.statistics.totalPersonsInSector ? (statistics.visitCount / this.statistics.totalPersonsInSector) * 100 : 0;
  
    this.profileDistPieChart.data = [
      this.statistics.staffPercentageInSector, 
      this.statistics.contractorsPercentageInSector, 
      this.statistics.visitorsPercentageInSector
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
  
  toggleWidgetDetails(widgetName: string) {
    if (this.currentWidgetTable == widgetName) {
      this.currentWidgetTable = null;
      return;
    }
    
    this.currentWidgetTable = widgetName;
    this._fetchwidgetTableRegisters(this.currentWidgetTable);    
  }
  
  goToWidgetTablePage(pageNum: number) {
    this.widgetTableCurrentPage = pageNum;    
    this._fetchwidgetTableRegisters(this.currentWidgetTable)
  }
  
  private _fetchwidgetTableRegisters(widgetName) {
    (function(widgetName){
      if (widgetName == 'En Planta') {
        return this.sectorService.getStatisticsDetails(this.currentSector, { page: this.widgetTableCurrentPage })
      } else if (widgetName == 'Empleados') {
        return this.sectorService.getStatisticsDetails(this.currentSector, { page: this.widgetTableCurrentPage, personType: 'staff' })
      } else if (widgetName == 'Contratistas') {
        return this.sectorService.getStatisticsDetails(this.currentSector, { page: this.widgetTableCurrentPage, personType: 'contractor' })
      } else if (widgetName == 'Visitas') {
        return this.sectorService.getStatisticsDetails(this.currentSector, { page: this.widgetTableCurrentPage, personType: 'visitor' })
      }    
    })
    .bind(this, widgetName)()
    .subscribe(statisticsDetails => {
      this.widgetTableTotalPages  = statisticsDetails.pages;
      this.widgetTableCurrentPage = statisticsDetails.page;
      this.widgetTableRegisters   = statisticsDetails.data;      
    }); 
  }
  
  ngOnDestroy() {
    this.activeSubscriptions.forEach(s => s.unsubscribe());
  }  
}
