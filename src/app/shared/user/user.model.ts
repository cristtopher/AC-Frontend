import { Serializable } from '../utils/serializable';


export class User extends Serializable {
  _id: string;
  name: string;
  role: string;
  company: any;
  
  constructor() {
    super();  
  }
};