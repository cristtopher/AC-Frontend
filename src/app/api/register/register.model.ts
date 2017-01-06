import { Serializable } from '../utils/serializable';
import { Person } from '../person/person.model';
import { Sector } from '../sector/sector.model';

export class Register extends Serializable {
  _id: string;
  person: Person;
  sector: Sector;
  time: number;
  type: string;
  isResolved: boolean;
  resolvedRegister: Register;
  comment: string;
  
  constructor() {
    super();  
  }
};