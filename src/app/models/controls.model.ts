import { ValidatorFn } from '@angular/forms';

export interface IControl {
  id: string;
  name: string;
  label: string;
  value: string;
  display: boolean;
  readonly: boolean;
  control: string;
  type: string;
  validators: ValidatorFn[];
}
