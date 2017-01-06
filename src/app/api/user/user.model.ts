import { Serializable } from '../utils/serializable';

import { Sector } from '../../api/sector/sector.model';

export class User extends Serializable {
  _id:  string;
  rut:  string;
  name: string;
  role: string;
  company: any;
  sectors: Sector[];
    
  constructor() {
    super();  
  }
};