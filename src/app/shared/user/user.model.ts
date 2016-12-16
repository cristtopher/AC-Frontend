import { Serializable } from '../utils/serializable';


export class User extends Serializable {
  name: string;
  _id: number;
    
  constructor() {
    super();  
  }
};