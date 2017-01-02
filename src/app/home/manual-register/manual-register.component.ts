import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CompleterService, CompleterData } from 'ng2-completer';

import * as moment from 'moment';

import { SectorService } from '../../api/sector/sector.providers';
import { RegisterService } from '../../api/register/register.providers';

import { Sector }   from '../../api/sector/sector.model';
import { Register } from '../../api/register/register.model';
import { Person }   from '../../api/person/person.model';

@Component({
  selector: 'app-manual-register',
  templateUrl: './manual-register.component.html',
  styleUrls: ['./manual-register.component.css']
})
export class ManualRegisterComponent implements OnInit {
  currentSector: Sector;
  
  candidatePersons: any[];
  
  selectedPerson: any;
  selectedRegisterType: string =  'entry';
  selectedRegisterTime: Date;
  registerComments: string;
  
  constructor(private sectorService: SectorService, private registerService: RegisterService) { }

  ngOnInit() {
    this.sectorService.currentSector.subscribe(currentSector => this.currentSector = currentSector);
  }

  public rutSelected(person) {
    if (!person) { return; }
    
    this.selectedPerson = person;
  }
    
  public rutInputKeyUp(event) {
    let currentInputValue = event.target.value;
    if (currentInputValue.length > 1) {
      //make a api request to get people.rut ~= currentInputValue
      this.candidatePersons = [{
        "_id": "5855d9b97f45b135cbb73ad1",
        "rut": "123-K",
        "name": "Person 1",
        "company": "585597684f6ad8244e26748e",
        "card":  1  
      }, {
        "_id": "5855d9ba7f45b135cbb73ad2",
        "rut": "456-K",
        "name": "Person 2",
        "company": "585597684f6ad8244e26748e",
        "card":  2  
      }, {
        "_id": "5855d9ba7f45b135cbb73ad3",
        "rut": "789-1",
        "name": "Person 3",
        "company": "585597684f6ad8244e26748f",
        "card":  3
      }];
      
      console.log(`got response: ${this.candidatePersons}`)
    }
  }
  
  public submitRegister() {
    var newRegister = new Register();
    
    newRegister.person = this.selectedPerson;
    newRegister.comment =  this.registerComments;
    
    if (this.selectedRegisterType === 'entry') {
      newRegister.entrySector = this.currentSector;
      newRegister.entryTime = moment(this.selectedRegisterTime).unix();
    } else if (this.selectedRegisterType === 'depart') {
      newRegister.departSector = this.currentSector;
      newRegister.departTime = moment(this.selectedRegisterTime).unix();
    }
    
    this.registerService.create(newRegister).subscribe(createdRegister => {
      console.log(`created Register: ${createdRegister}`)
    })
  }

}
