import {
  AfterViewInit,
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { FormStateService } from '../form-state.service';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormGroupComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => FormGroupComponent),
    },
  ],
})
export class FormGroupComponent
  implements ControlValueAccessor, OnInit, AfterViewInit
{
  @Input() group!: {
    groups: [];
    arrays: [];
    controls: [{
      id: string,
      name: string,
      label: string,
      value: string,
      display: boolean,
      readonly: boolean,
      control: string,
      type: string,
      validators: ValidatorFn[],
    }];
  };
  @Input() name!: string;

  public form: FormGroup = new FormGroup({});
  public groupLabels: string[] = [];
  public arrayLabels: string[] = [];
  public onChanged: any = () => {};
  public onTouched: any = () => {};
  public onValidationChange: any = () => {};

  public initialValidity = false;

  constructor(private fb: FormBuilder, private formState: FormStateService) {}

  ngOnInit() {
    if (this.group.groups.length) {
      this.group.groups.forEach((group) => {
        this.groupLabels.push(Object.keys(group)[0]);
        this.form.addControl(Object.keys(group)[0], this.fb.control({}));
      });
    }
    if (this.group.arrays.length) {
      this.group.arrays.forEach((array) => {
        this.arrayLabels.push(Object.keys(array)[0]);
        this.form.addControl(Object.keys(array)[0], this.fb.control({}));
      });
    }
    if (this.group.controls.length) {
      this.group.controls.forEach((control) => {
        this.form.addControl(control.name, this.fb.control({}));
      });
    }
    this.formState.touchedState.subscribe(() => {
      this.onTouched();
    });
    this.form.valueChanges.subscribe((val) => {
      this.onChanged(val);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.form.markAsPristine();
      this.form.updateValueAndValidity();
    });
  }

  writeValue() {
    // not needed
  }

  registerOnChange(fn: (val: any) => void) {
    this.onChanged = fn;
  }

  setDisabledState(disabled: boolean) {
    disabled ? this.form.disable() : this.form.enable();
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
  validate(control: AbstractControl): ValidationErrors {
    return !this.form.valid
      ? { invalidGroup: { valid: false, message: 'Group is invalid' } }
      : null;
  }
  isObject(obj: any): boolean {
    return typeof obj === 'object';
  }

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }
}
