import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl} from '@angular/platform-browser';

@Pipe({
  name: 'notNull'
})
export class NotNullPipe implements PipeTransform {

  public transform<T>(value: T | null): T {
    return value as T;
  }
}
