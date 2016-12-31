import { Serializable } from '../utils/serializable';

export class Person extends Serializable {
  _id: string;
  rut: string;
  name: string;
  companyName: string;
  
  constructor() {
    super();  
  }  
};