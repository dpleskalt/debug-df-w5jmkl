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

export class CControl {
  id: string;
  name: string;
  label: string;
  value: string;
  display: boolean;
  readonly: boolean;
  control: string;
  type: string;
  validators: ValidatorFn[];

  constructor(
    props: {
      id?: string;
      name?: string;
      label?: string;
      value?: string;
      display?: boolean;
      readonly?: boolean;
      control?: string;
      type?: string;
      validators?: ValidatorFn[];
    } = {}
  ) {
    this.id = props.id || '';
    this.name = props.name || '';
    this.label = props.label || '';
    this.value = props.value || null;
    this.display = props.display || true;
    this.readonly = props.readonly || false;
    this.control = props.control || 'input';
    this.type = props.type || 'text';
    this.validators = props.validators || null;
  }
}
