import { IArray } from './array.model';
import { IControl } from './controls.model';
import { IGroup } from './group.model';

export interface IForm {
  groups: IGroup[];
  arrays: IArray[];
  controls: IControl[];
}
