import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs';
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

  constructor(private fb: FormBuilder, private modelService: ModelService) {}

  ngOnInit() {
    this.modelService
      .get()
      .pipe(take(1))
      .subscribe((m) => {
        this.model = m;
        /* if (this.model.groups.length) {
          this.model.groups.forEach((group) => {
            this.groupLabels.push(Object.keys(group)[0]);
            this.form.addControl(Object.keys(group)[0], this.fb.control({}));
          });
        }
        if (this.model.controls.length) {
          this.model.groups.forEach((group) => {
            this.controlLabels.push(Object.keys(group)[0]);
            this.form.addControl(Object.keys(group)[0], this.fb.control({}));
          });
        } */
        if (this.model.groups.length) {
          this.model.groups.forEach((group) => {
            this.groupLabels.push(Object.keys(group)[0]);
            this.form.addControl(Object.keys(group)[0], this.fb.control({}));
          });
        }
        if (this.model.arrays.length) {
          let index = 0;
          this.model.arrays.forEach(() => {
            this.form.addControl(index.toString(), this.fb.control({}));
            index += 1;
          });
        }
        if (this.model.controls.length) {
          this.model.controls.forEach((control) => {
            this.form.addControl(control.id, this.fb.control({}));
          });
        }
      });
  }

  isObject(obj: any): boolean {
    return typeof obj === 'object';
  }

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log(this.form);
      this.form.markAsPristine();
      this.form.updateValueAndValidity();
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
