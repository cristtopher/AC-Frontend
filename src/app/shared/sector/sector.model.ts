import { Serializable } from '../utils/serializable';

export class Sector extends Serializable {
  _id: string;
  name: string;
  description: string;
  company: any;
  
  constructor() {
    super();  
  }
};