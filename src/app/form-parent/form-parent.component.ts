import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs';
import { FormStateService } from '../form-state.service';
import { ModelService } from '../model.service';
import { IForm } from '../models/form.model';

@Component({
  selector: 'app-form-parent',
  templateUrl: './form-parent.component.html',
  styleUrls: ['./form-parent.component.css'],
})
export class FormParentComponent implements OnInit, AfterViewInit {
  public form: FormGroup = new FormGroup({});
  public model: IForm;
  public groupLabels: string[] = [];
  public controlLabels: string[] = [];
  public parentControls: any[] = [];

  private allControls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private modelService: ModelService,
    private formState: FormStateService
  ) {}

  ngOnInit() {
    this.modelService
      .get()
      .pipe(take(1))
      .subscribe((m) => {
        this.model = m;
        if (this.model.groups.length) {
          this.model.groups.forEach((group) => {
            this.groupLabels.push(Object.keys(group)[0]);
            this.form.addControl(Object.keys(group)[0], this.fb.control({}));
            this.allControls.push(Object.keys(group)[0]);
            let initArray: string[] = [];
            initArray.push(Object.keys(group)[0]);
            this.parentControls.push(initArray);
          });
        }
        if (this.model.arrays.length) {
          let index = 0;
          this.model.arrays.forEach(() => {
            this.form.addControl(index.toString(), this.fb.control({}));
            this.allControls.push(index.toString());
            let initArray: string[] = [];
            initArray.push(index.toString());
            this.parentControls.push(initArray);
            index += 1;
          });
        }
        if (this.model.controls.length) {
          this.model.controls.forEach((control) => {
            this.form.addControl(control.id, this.fb.control({}));
            this.formState.addControl(control.id);
            this.allControls.push(control.id);
          });
        }
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.form.markAsPristine();
      this.form.updateValueAndValidity();
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
