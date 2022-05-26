import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CFormModel } from './data/form-model';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  get(): Observable<any> {
    return of(CFormModel);
  }
}
