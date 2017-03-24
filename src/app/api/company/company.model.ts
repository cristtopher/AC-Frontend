import { Serializable } from '../utils/serializable';

export class Company extends Serializable {
  _id: string;
  logo: string;
  name: string;

  constructor() {
    super();
  }
};
