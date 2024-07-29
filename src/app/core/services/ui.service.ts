import {Injectable, signal} from '@angular/core';

import {DeviceDetectorService} from 'ngx-device-detector';
import {TemplatePortal} from '@angular/cdk/portal';
import {AppStore} from "../state/app-store";


@Injectable({
  providedIn: 'root'
})
export class UiService {
  public subMenu =  signal<TemplatePortal | null>(null)
  public headerMenu =  signal<TemplatePortal | null>(null)

  constructor(coreStore: AppStore, private deviceService: DeviceDetectorService) {
    coreStore.setUiState(deviceService.isMobile())
  }

  public setSubMenu(portal: TemplatePortal | null) {
    setTimeout(() => {
      this.subMenu.set(portal);
    }, 1);
  }

  public setHeaderMenu(portal: TemplatePortal | null) {
    setTimeout(() => {
      this.headerMenu.set(portal);
    }, 1);
  }
}
