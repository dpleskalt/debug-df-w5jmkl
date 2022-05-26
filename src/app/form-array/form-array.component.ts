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
} from '@angular/forms';
import { FormStateService } from '../form-state.service';

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
  @Input() formArray: {
    [id: string]: {
      addControls: boolean;
      addControlsLabel: string;
      defaultControls: string[];
      groups: [];
      arrays: [];
      controls: [{ id: string; name: string; label: string; value: any }];
    };
  };

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
        if (value.controls.length) {
          value.controls.forEach((control) => {
            this.getFormGroup(key).addControl(
              control.name,
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
}
