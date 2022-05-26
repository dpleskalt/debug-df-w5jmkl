import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getObject',
})
export class GetObjectPipe implements PipeTransform {
  transform(value: any, key: any): any {
    return value.find((x: { [x: string]: any }) => x[key] !== undefined)[key];
  }
}
