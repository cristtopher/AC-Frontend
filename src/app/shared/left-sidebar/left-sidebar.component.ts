import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { User } from '../../shared/user/user.model';

import { Sector } from '../../shared/sector/sector.model';
import { SectorService } from '../../shared/sector/sector.providers';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  @Input() currentUser: User;
  @Input() sectors: Sector[];
  
  @Output() changedSectorEvent = new EventEmitter();
    
  constructor(private sectorService: SectorService) { }

  ngOnInit() { }

  changeSector() {
    console.log(`Sector was changed to: ${this.currentUser.currentSector._id}`);
    this.changedSectorEvent.emit(this.currentUser.currentSector);
  }
}
