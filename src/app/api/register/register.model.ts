import { Serializable } from '../utils/serializable';
import { Person } from '../person/person.model';
import { Sector } from '../sector/sector.model';

export class Register extends Serializable {
  _id: string;
  person: Person;
  entrySector:  Sector;
  departSector: Sector;
  entryTime: string;
  departTime: string;
  comment: string;
  
  constructor() {
    super();  
  }
};