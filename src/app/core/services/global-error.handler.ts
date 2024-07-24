import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {AppStore} from "../state/app-store";


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {
  }

  handleError(error: any) {
    if (error.rejection) {
      this.injector.get(AppStore).addMessage(error.rejection);
    } else {
      throw error;
    }
  }
}
