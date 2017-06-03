import { Serializable } from '../utils/serializable';

export class Person extends Serializable {
  _id: string;
  rut: string;
  name: string;
  company: any;
  type: string = 'staff';
  card: number;
  active: boolean = true;
  
  constructor() {
    super();  
  }  
};