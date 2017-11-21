import { Serializable } from '../utils/serializable';

export class Vehicle extends Serializable {
  _id: string;
  patent: string;
  sector: any;
  type: string = 'car';
  inside: boolean = false;

  constructor() {
    super();
  }
};
