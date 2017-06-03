import { Serializable } from '../utils/serializable';

export class Person extends Serializable {
  _id: string;
  rut: string;
  name: string;
  company: any;
  companyInfo: string;
  type: string = 'staff';
  card: number;
  active: boolean = true;
  
  constructor() {
    super();  
  }  
};