import { IControl } from './controls.model';
import { IGroup } from './group.model';

export interface IArray {
  [id: string]: {
    addControls: boolean;
    addControlsLabel: string;
    defaultControls: string[];
    groups: IGroup[];
    arrays: IArray[];
    controls: IControl[];
  };
}
