import { Serializable } from '../utils/serializable';


export class Person extends Serializable {
  _id: number;
  rut: string;
  name: string;
  company: any;
  
  constructor() {
    super();  
  }
};