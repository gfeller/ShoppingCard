import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';

import {CoreState} from '../state/core/reducer';
import * as CoreActions from '../state/core/actions';
import {uiInformationChanged} from '../state/core/actions';
import {State} from '../state';
import {DeviceDetectorService} from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private coreStore: Store<State>, private deviceService: DeviceDetectorService) {
    coreStore.dispatch(uiInformationChanged({info: {isMobile: deviceService.isMobile()}}));

    /*
    window.addEventListener('resize', (event) => {
      coreStore.dispatch(uiInformationChanged({info: {isMobile: deviceService.isMobile()}}));
    });*/
  }
}
