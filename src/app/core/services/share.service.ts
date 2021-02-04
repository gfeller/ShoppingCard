import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';

import {CoreState} from '../state/core/reducer';
import * as CoreActions from '../state/core/actions';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private  store: Store<CoreState>) {
  }


  share(message: string, url: string) {
    navigator.share({
      title: 'ShoppingCard',
      text: message,
      url
    }).then(_ => this.store.dispatch(CoreActions.message({message: 'Wurde erfolgreich geteilt.'})))
      .catch(error => this.store.dispatch(CoreActions.message({message: 'Wurde nicht geteilt.'})));

  }
}
