import { IArray } from './array.model';
import { IControl } from './controls.model';

export interface IGroup {
  [id: string]: {
    groups: IGroup[];
    arrays: IArray[];
    controls: IControl[];
  };
}
