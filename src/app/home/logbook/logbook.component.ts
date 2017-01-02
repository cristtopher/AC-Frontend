import { Component, OnInit } from '@angular/core';

import { SocketService } from '../../api/socket/socket.service';
import { SectorService } from '../../api/sector/sector.providers';
import { Sector } from '../../api/sector/sector.model';

@Component({
  selector: 'app-logbook',
  templateUrl: './logbook.component.html',
  styleUrls: ['./logbook.component.css']
})
export class LogbookComponent implements OnInit {
  currentSector: Sector;
  currentFilter: string;
  
  constructor(private socketService: SocketService, private sectorService: SectorService) { }

  ngOnInit() {
    this.sectorService.currentSector.subscribe(currentSector => this.currentSector = currentSector )
  }

  toggleFilter(filterName: string) {
    console.log(`setting currentFilter to: ${filterName}`)
    
    if(this.currentFilter === filterName) { 
      this.currentFilter = null; 
    } else {
      this.currentFilter = filterName;
    }
    
  }

}
