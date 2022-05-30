import { IArray } from './array.model';
import { IControl } from './controls.model';

export interface IGroup {
  [id: string]: {
    groups?: IGroup[];
    arrays?: IArray[];
    controls?: IControl[];
  };
}

export class CGroup {
  [id: string]: {
    groups?: IGroup[];
    arrays?: IArray[];
    controls?: IControl[];
  };

  constructor(
    props: {
      [id: string]: {
        groups?: IGroup[];
        arrays?: IArray[];
        controls?: IControl[];
      };
    } = {}
  ) {
    this.id = props.id;
    this.id.groups = props.id.groups || [];
    this.id.arrays = props.id.arrays || [];
    this.id.controls = props.id.controls || [];
  }
}
