import { Serializable } from '../utils/serializable';

export class User extends Serializable {
  _id:  string;
  rut:  string;
  name: string;
  role: string;
  company: any;
  sector:  any;
  
  constructor() {
    super();  
  }
};