import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';

import {CoreState} from '../state/core/reducer';
import * as CoreActions from '../state/core/actions';

@Injectable({
  providedIn: 'root'
})
export class OnlineService {

  constructor(private  state: Store<CoreState>) {
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }


  updateOnlineStatus() {
    this.state.dispatch(CoreActions.netState({online: navigator.onLine}));
  }
}
