import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { SectorService } from '../../api/sector/sector.providers';
import { RegisterService } from '../../api/register/register.providers';
import { PersonService } from '../../api/person/person.providers';

import { Sector }   from '../../api/sector/sector.model';
import { Register } from '../../api/register/register.model';
import { Person }   from '../../api/person/person.model';

import * as moment from 'moment';

@Component({
  selector: 'app-manual-register',
  templateUrl: './manual-register.component.html',
  styleUrls: ['./manual-register.component.css']
})
export class ManualRegisterComponent implements OnInit {
  currentSector: Sector;
  
  searchBox: FormControl = new FormControl();
  manualRegisterForm: FormGroup = new FormGroup({
    searchBox: this.searchBox
  });

  // list of candidates in searchBox and some searchBox statuses
  candidatePersons:Observable<Person[]>;
  isSearchBoxLoading:boolean = false;
  hasSearchBoxResults:boolean = false;
  
  
  // TODO: replace all of these with FormControls...
  selectedRegisterType: string =  'entry';
  selectedRegisterTime: Date;
  registerComments: string;

  constructor(private sectorService: SectorService, private registerService: RegisterService, private personService: PersonService) {
    this.candidatePersons = Observable.create((observer: any) => observer.next(this.searchBox.value))
                                      .mergeMap((currentRut: string) => this.personService.get({ rut: currentRut, sector: this.currentSector }));
  }

  ngOnInit() {
    this.sectorService.currentSector.subscribe(currentSector => this.currentSector = currentSector);
  }

  public searchBoxLoading(e: boolean): void {
    this.isSearchBoxLoading = e;
  }

  public searchBoxNoResults(e: boolean): void {
    this.hasSearchBoxResults = !e;
  }
  
  public searchBoxOnSelect(e:any): void {
    console.log('Selected value: ', e.item);
  }
  
  public submitRegister() {
    var newRegister = new Register();
    
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
