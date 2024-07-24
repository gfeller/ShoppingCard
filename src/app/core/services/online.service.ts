import {inject, Injectable} from '@angular/core';

import {AppStore} from "../state/core/app-store";


@Injectable({
  providedIn: 'root'
})
export class OnlineService {
  appStore = inject(AppStore)

  constructor() {
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }


  updateOnlineStatus() {
    this.appStore.setNetState(navigator.onLine);
  }
}
