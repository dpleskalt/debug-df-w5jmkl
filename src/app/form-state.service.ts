import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface controlState {
  [id: string]: {
    parentControl: any[];
    touched: {
      state: boolean;
      parentUpdated: boolean;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  protected controlList = new BehaviorSubject<controlState[]>([]);
  protected control = new BehaviorSubject<controlState>({});
  controls = this.controlList.asObservable();
  updatedControl = this.control.asObservable();

  addControl(controlId: string, parentControls?: any[]) {
    let newControl: controlState;
    newControl = {
      [controlId]: {
        parentControl: parentControls,
        touched: { state: false, parentUpdated: false },
      },
    };
    this.controlList.value.push(newControl);
    this.controlList.next(this.controlList.value);
  }

  setTouchedState(controlId: string) {
    let i = 0;
    let tmp: controlState = {};
    this.controlList.value.forEach((control) => {
      if (Object.keys(control).indexOf(controlId) !== -1) {
        tmp = control;
        tmp[controlId].touched.state = true;
        this.controlList.value.splice(i, 1);
        this.controlList.value.push(tmp);
      }
      i += 1;
    });
    this.control.next(tmp);
    console.log(tmp);
    this.controlList.next(this.controlList.value);
  }

  setTouchedParentUpdated(controlId: string) {
    let i = 0;
    this.controlList.value.forEach((control) => {
      if (Object.keys(control).indexOf(controlId) !== -1) {
        const updatedControl = control;
        updatedControl[controlId].touched.parentUpdated = true;
        this.controlList.value.splice(i, 1);
        this.controlList.value.push(updatedControl);
      }
      i += 1;
    });
    this.controlList.next(this.controlList.value);
  }
}
