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
} from '@angular/forms';
import { FormStateService } from '../form-state.service';
import { IArray } from '../models/array.model';
import { IControl } from '../models/controls.model';
import { IGroup } from '../models/group.model';

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
  @Input() group: IGroup;
  @Input() name: string;

  public form: FormGroup = new FormGroup({});
  public groupLabels: string[] = [];
  public arrayLabels: string[] = [];
  public index = 0;
  public groups: IGroup[];
  public arrays: IArray[];
  public controls: IControl[];
  public initialValidity = false;

  public onChanged: any = () => {};
  public onTouched: any = () => {};

  constructor(private fb: FormBuilder, private formState: FormStateService) {}

  ngOnInit() {
    this.groups = this.group.groups as unknown as IGroup[];
    if (this.groups.length) {
      this.groups.forEach((group) => {
        this.groupLabels.push(Object.keys(group)[0]);
        this.form.addControl(Object.keys(group)[0], this.fb.control({}));
      });
    }
    this.arrays = this.group.arrays as unknown as IArray[];
    if (this.arrays.length) {
      this.index = 0;
      this.arrays.forEach(() => {
        this.form.addControl(this.index.toString(), this.fb.control({}));
        this.index += 1;
      });
    }
    this.controls = this.group.controls as unknown as IControl[];
    if (this.controls.length) {
      this.controls.forEach((control) => {
        this.form.addControl(control.id, this.fb.control({}));
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
}
