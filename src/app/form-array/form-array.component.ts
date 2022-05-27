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
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { uuid } from 'uuidv4';
import { FormStateService } from '../form-state.service';
import { IArray } from '../models/array.model';
import { Control } from '../models/controls.model';

@Component({
  selector: 'app-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormArrayComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => FormArrayComponent),
    },
  ],
})
export class FormArrayComponent
  implements ControlValueAccessor, OnInit, AfterViewInit
{
  @Input() formArray: IArray[];

  public form: FormGroup = new FormGroup({});
  public arrayLabels: string[] = [];
  onChanged: any = () => {};
  onTouched: any = () => {};
  onValidationChange: any = () => {};

  public initialValidity = false;

  constructor(private fb: FormBuilder, private formState: FormStateService) {}

  ngOnInit() {
    if (this.formArray) {
      Object.entries(this.formArray).forEach(([key, value]) => {
        this.arrayLabels.push(key);
        this.form.addControl(key, this.fb.array([new FormGroup({})]));
        if (value.controls) {
          Object.keys(value.controls).forEach((control) => {
            console.log(value.controls[control]);
            this.getFormGroup(key).addControl(
              value.controls[control].name,
              this.fb.control({})
            );
          });
        }
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
      this.form.markAsUntouched();
      this.form.markAsPristine();
      this.form.updateValueAndValidity();
    });
  }

  getFormGroup(label: string): FormGroup {
    const arr = this.form.get(label) as FormArray;
    return arr.controls[0] as FormGroup;
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

  addNewControlsToArray(arrayLabel: string) {
    console.log('Add controls to array');
    console.log(this.formArray[arrayLabel].defaultControls);
    this.formArray[arrayLabel].defaultControls.forEach((id) => {
      this.formArray[arrayLabel].controls.forEach((control) => {
        if (control.id === id) {
          const newControl = new Control(control);
          newControl.id = uuid();
          newControl.readonly = false;
          newControl.value = null;
          this.formArray[arrayLabel].controls.push(newControl);
        }
      });
    });
  }
}
