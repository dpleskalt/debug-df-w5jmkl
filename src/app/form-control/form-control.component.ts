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
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
import { FormStateService } from '../form-state.service';
import { IControl } from '../models/controls.model';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormControlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => FormControlComponent),
    },
  ],
})
export class FormControlComponent
  implements ControlValueAccessor, Validator, OnInit, AfterViewInit
{
  @Input() control: IControl;
  @Input() parentControls: any[];

  public fc!: FormControl;
  public onChanged: any = () => {};
  public onTouched: any = () => {};

  constructor(private formState: FormStateService) {}

  ngOnInit() {
    this.fc = new FormControl('', {
      validators: this.control['validators'] as ValidatorFn[],
    });
    /* this.formState.controls.subscribe((controls) => {
      // this.onTouched();
    }); */
    this.fc.valueChanges.subscribe((val) => {
      this.onChanged(val);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.fc.updateValueAndValidity();
    });
  }

  writeValue() {
    this.control['label'] &&
      this.fc.setValue(this.control['value'], { emitEvent: false });
  }

  registerOnChange(fn: (val: any) => void) {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    disabled ? this.fc.disable() : this.fc.enable();
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return !this.fc.valid
      ? { invalidControl: { valid: false, message: 'Control is invalid' } }
      : null;
  }

  setTouchedState() {
    this.onTouched();
    this.formState.setTouchedState(this.control.id);
  }
}
