import {
  AfterViewInit,
  ChangeDetectorRef,
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
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { FormStateService } from '../form-state.service';
import { IArray } from '../models/array.model';
import { Control, IControl } from '../models/controls.model';

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
  private newControlsArray: IControl[] = [];
  private formArrayLabel: string;

  constructor(
    private fb: FormBuilder,
    private formState: FormStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.formState.touchedState.subscribe(() => {
      this.onTouched();
    });
    this.form.valueChanges.subscribe((val) => {
      this.onChanged(val);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.addControlsFromModel();
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

  addControlsFromModel() {
    if (this.formArray) {
      Object.entries(this.formArray).forEach(([key, value]) => {
        this.arrayLabels.push(key);
        this.form.addControl(key, this.fb.array([new FormGroup({})]));
        if (value.controls) {
          Object.keys(value.controls).forEach((control) => {
            this.getFormGroup(key).addControl(
              value.controls[control].id,
              this.fb.control({})
            );
          });
        }
      });
    }
  }

  addNewControlsToArray(label: string) {
    this.formArray[label].defaultControls.forEach((id) => {
      this.formArray[label].controls.forEach((control) => {
        if (control.id === id) {
          let newControl = new Control(control);
          newControl = {
            ...newControl,
            id: uuidv4(),
            readonly: false,
            value: null,
          };
          this.formArrayLabel = label;
          this.getFormGroup(label).addControl(
            newControl.id,
            this.fb.control({})
          );
          this.formArray[label].controls.push(newControl);
          this.cdr.detectChanges();
        }
      });
    });
  }

  removeControlFromArray(label: string, id: string, index: number) {
    if(this.formArray[label].defaultControls.indexOf(id) === -1) {
      this.formArray[label].controls.removeAt(index);
      this.cdr.detectChanges();
    }
  }
}
