import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  protected touched = new BehaviorSubject<boolean>(false);
  touchedState = this.touched.asObservable();

  setTouchedState(state: boolean) {
    if (this.touched.value === false) {
      this.touched.next(state);
    }
  }
}
