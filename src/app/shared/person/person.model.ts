import { Serializable } from '../utils/serializable';


export class Person extends Serializable {
  name: string;
  _id: number;
  role: string;
  company: any;
  
  constructor() {
    super();  
  }
};