import { IArray } from "./array.model";
import { IControl } from "./controls.model";

export interface IGroup {
  [id: string]: {
    groups: IGroup[],
    arrays: IArray[],
    controls: IControl[],
  }
}

export class Group {
  groups: IGroup[];
  arrays: IArray[];
  controls: IControl[];

  constructor(
    props: {
      groups?: IGroup[];
      arrays?: IArray[];
      controls?: IControl[];
    } = {},
  ) {
    this.groups = props.groups || [];
    this.arrays = props.arrays || [];
    this.controls = props.controls || [];
  }
}