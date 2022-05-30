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
import { CControl, IControl } from '../models/controls.model';
import { IGroup } from '../models/group.model';

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
  @Input() formArray: IArray;

  public form: FormGroup = new FormGroup({});
  public arrayLabels: string[] = [];
  public groupsArray: IGroup[];
  public arrayOfIndexes: number[] = [];
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
    this.addFormArray();
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

  getControls(key: string, index: number) {
    let controls: IControl[];
    Object.values(this.formArray[key].groups[index]).forEach((value) => {
      controls = value.controls as unknown as IControl[];
    });
    return controls;
  }

  addFormArray() {
    if (this.formArray) {
      Object.entries(this.formArray).forEach(([key, value]) => {
        this.arrayLabels.push(key);
        this.form.addControl(key, this.fb.array([]));
        if (value.groups) {
          const index = 0;
          this.addFormGroupToArray(
            key,
            index,
            value.groups as unknown as IGroup[]
          );
        }
      });
    }
  }

  addFormGroupToArray(
    key: string,
    index: number,
    groups?: IGroup[],
    control?: IControl[]
  ) {
    if (groups) {
      groups.forEach((group) => {
        const arr = this.form.get(key) as FormArray;
        arr.push(new FormGroup({}));
        Object.values(group).forEach((value) => {
          this.addControlsToGroup(
            arr,
            index,
            value.controls as unknown as IControl[]
          );
        });
        this.arrayOfIndexes.push(index);
        index += 1;
      });
    } else {
      const arr = this.form.get(key) as FormArray;
      if (!arr.controls[index]) {
        arr.push(new FormGroup({}));
      }
      this.addControlsToGroup(arr, index, control);
    }
  }

  addControlsToGroup(arr: FormArray, index: number, controls: IControl[]) {
    const group = arr.controls[index] as FormGroup;
    controls.forEach((control) => {
      group.addControl(control.id, this.fb.control({}));
    });
  }

  addNewControls(key: string) {
    const index = this.formArray[key].groups.length;
    this.formArray[key].defaultControls.forEach((id) => {
      Object.entries(this.formArray[key].groups[0]).forEach(
        ([label, value]) => {
          const initialControls = value.controls as unknown as IControl[];
          initialControls.forEach((control) => {
            if (control.id === id) {
              let newControl: IControl[] = [];
              const cnt = {
                ...control,
                id: uuidv4(),
                readonly: false,
                display: true,
                value: null,
              };
              newControl.push(new CControl(cnt));
              this.addFormGroupToArray(key, index, null, newControl);
              if (!this.formArray[key].groups[index]) {
                this.formArray[key].groups.push({
                  [label]: { groups: [], arrays: [], controls: [] },
                });
                this.formArray[key].groups[index][label].controls.push(cnt);
                this.arrayOfIndexes.push(index);
                this.cdr.detectChanges();
              } else {
                this.formArray[key].groups[index][label].controls.push(cnt);
                this.cdr.detectChanges();
              }
            }
          });
        }
      );
    });
  }

  removeControls(key: string, index: number) {
    const arr = this.form.get(key) as FormArray;
    arr.removeAt(index);
    this.formArray[key].groups.splice(index, 1);
    this.arrayOfIndexes.splice(index, 1);
    this.cdr.detectChanges();
  }
}
