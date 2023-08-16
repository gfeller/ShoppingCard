import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {Store} from '@ngrx/store';

import * as CoreActions from '../state/core/actions';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {
  }

  handleError(error: any) {
    if (error.rejection) {
      this.injector.get(Store).dispatch(CoreActions.addError(error.rejection));
    } else {
      throw error;
    }
  }
}

