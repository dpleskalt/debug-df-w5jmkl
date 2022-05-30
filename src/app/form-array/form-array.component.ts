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
import { Group, IGroup } from '../models/group.model';

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

  addFormArray() {
    if (this.formArray) {
      Object.entries(this.formArray).forEach(([key, value]) => {
        this.arrayLabels.push(key);
        this.form.addControl(key, this.fb.array([]));
        console.log(this.formArray[key]);
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
        this.addControlsToGroup(
          arr,
          index,
          group.controls as unknown as IControl[]
        );
        this.arrayOfIndexes.push(index);
        index += 1;
      });
    } else {
      const arr = this.form.get(key) as FormArray;
      if (!arr.controls[index]) {
        arr.push(new FormGroup({}));
        this.arrayOfIndexes.push(index);
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
      this.formArray[key].groups[0].controls.forEach((control) => {
        if (control.id === id) {
          let newControl: IControl[] = [];
          const cnt = {
            ...newControl,
            id: uuidv4(),
            readonly: false,
            value: null,
          };
          newControl.push(new Control(cnt));
          this.addFormGroupToArray(key, index, null, newControl);
          if (!this.formArray[key].groups[index]) {
            this.formArray[key].groups[index] = new Group();
            this.formArray[key].groups[index].controls.push(cnt);
            this.cdr.detectChanges();
          } else {
            this.formArray[key].groups[index].controls.push(cnt);
            this.cdr.detectChanges();
          }
        }
      });
    });
  }

  /* addControlsFromModel() {
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

  addControlsFromModelToArray() {
    if (this.formArray) {
      Object.entries(this.formArray).forEach(([key, value]) => {
        this.fArray.push(new FormGroup({}));
        this.arrayLabels.push(key);
        if (value.controls) {
          const index = this.fArray.length - 1;
          const fGroup = this.fArray.controls[index] as FormGroup;
          Object.keys(value.controls).forEach((key) => {
            fGroup.addControl(value.controls[key].id, this.fb.control({}));
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

  addNewControlsToArray2() {}

  removeControlFromArray(label: string, id: string, index: number) {
    if (this.formArray[label].defaultControls.indexOf(id) === -1) {
      this.formArray[label].controls.removeAt(index);
      this.cdr.detectChanges();
    }
  } */
}
