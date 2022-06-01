import { I } from '@angular/cdk/keycodes/keycodes';
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
  @Input() index: any;
  @Input() parentControls: any[];

  public form: FormGroup = new FormGroup({});
  public arrayLabels: string[] = [];
  public groupsArray: IGroup[];
  public arrayOfIndexes: number[] = [];
  public initialValidity = false;

  private controls: IControl[] = [];
  private parent: string;

  onChanged: any = () => {};
  onTouched: any = () => {};

  constructor(
    private fb: FormBuilder,
    private formState: FormStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.addFormArray();
    this.formState.updatedControl.subscribe((c) => {
      const id = Object.keys(c)[0];
      if (this.form.get(id)) {
        this.onTouched();
      }
      if (c[id]?.parentControl) {
        c[id].parentControl.forEach((id) => {
          if (this.form.get(id)) {
            this.onTouched();
          }
        });
      }
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
        if (value.groups) {
          this.addFormGroupToArray(key, 0, value.groups as unknown as IGroup[]);
        }
      });
    }
  }

  addFormGroupToArray(
    key: string,
    i: number,
    groups?: IGroup[],
    control?: IControl[]
  ) {
    if (groups) {
      groups.forEach((group) => {
        const arr = this.form.get(key) as FormArray;
        arr.push(new FormGroup({}));
        let ind = 0;
        Object.values(group).forEach((value) => {
          this.addControlsToGroup(
            arr,
            i,
            value.controls as unknown as IControl[]
          );
        });
        this.arrayOfIndexes.push(i);
        i += 1;
      });
    } else {
      const arr = this.form.get(key) as FormArray;
      if (!arr.controls[i]) {
        arr.push(new FormGroup({}));
      }
      this.addControlsToGroup(arr, i, control);
    }
  }

  addControlsToGroup(arr: FormArray, i: number, cntArray: IControl[]) {
    const group = arr.controls[i] as FormGroup;
    let tmpList: any[];
    cntArray.forEach((control) => {
      this.controls.push(control);
      group.addControl(control.id, this.fb.control({}));
      this.parentControls.forEach((list) => {
        if (list.indexOf(this.index.toString()) !== -1) {
          const tmp: any[] = [];
          tmp.push(list[0]);
          tmp.push(this.index.toString());
          this.formState.addControl(control.id, tmp);
        }
      });
      this.formState.addControl(control.id, tmpList);
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
