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
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { skip } from 'rxjs';
import { FormStateService } from '../form-state.service';

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
  @Input() control!: {};

  public fc!: FormControl;
  public onChanged: any = () => {};
  public onTouched: any = () => {};

  constructor(private formState: FormStateService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fc = new FormControl('', {
      validators: this.control['validators'] as ValidatorFn[],
    });
    this.formState.controlAdded.subscribe((state) => {
      if (state === true) {
        this.formState.setControlAdded(false);
        this.cdr.detectChanges();
      }
    });
    this.formState.touchedState.subscribe(() => {
      this.onTouched();
    });
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

  setDisabledState(disabled: boolean) {
    disabled ? this.fc.disable() : this.fc.enable();
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
  validate(c: AbstractControl): ValidationErrors | null {
    return !this.fc.valid
      ? { invalidControl: { valid: false, message: 'Control is invalid' } }
      : null;
  }

  setTouchedState() {
    this.formState.setTouchedState(this.fc.touched);
    this.onTouched();
  }
}
