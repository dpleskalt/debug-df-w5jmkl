import { IControl } from './controls.model';
import { IGroup } from './group.model';

export interface IArray {
  [id: string]: {
    addControls?: boolean;
    addControlsLabel?: string;
    defaultControls?: string[];
    groups?: IGroup[];
    arrays?: IArray[];
    controls?: IControl[];
  };
}

export class CArray {
  [id: string]: {
    addControls?: boolean;
    addControlsLabel?: string;
    defaultControls?: string[];
    groups?: IGroup[];
    arrays?: IArray[];
    controls?: IControl[];
  };

  constructor(
    props: {
      [id: string]: {
        addControls?: boolean;
        addControlsLabel?: string;
        defaultControls?: string[];
        groups?: IGroup[];
        arrays?: IArray[];
        controls?: IControl[];
      };
    } = {}
  ) {
    this.id = props.id;
    this.id.addControls = props.id.addControls || false;
    this.id.addControlsLabel = props.id.addControlsLabel || '';
    this.id.defaultControls = props.id.defaultControls || [];
    this.id.groups = props.id.groups || [];
    this.id.arrays = props.id.arrays || [];
    this.id.controls = props.id.controls || [];
  }
}
