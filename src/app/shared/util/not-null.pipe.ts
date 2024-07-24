import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'notNull'
})
export class NotNullPipe implements PipeTransform {

  public transform<T>(value: T | null | undefined): T {
    return value as T;
  }
}
