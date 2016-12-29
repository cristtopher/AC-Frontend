import { Serializable } from '../utils/serializable';

import { Sector } from '../../shared/sector/sector.model';

export class User extends Serializable {
  _id:  string;
  rut:  string;
  name: string;
  role: string;
  company: any;
  sector:  any;
  
  currentSector: Sector;
  
  constructor() {
    super();  
  }
};