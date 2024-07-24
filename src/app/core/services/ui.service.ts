import {Injectable} from '@angular/core';

import {DeviceDetectorService} from 'ngx-device-detector';
import {TemplatePortal} from '@angular/cdk/portal';
import {BehaviorSubject} from 'rxjs';
import {AppStore} from "../state/app-store";


@Injectable({
  providedIn: 'root'
})
export class UiService {
  public subMenu: BehaviorSubject<TemplatePortal | null> = new BehaviorSubject<TemplatePortal | null>(null);
  public headerMenu: BehaviorSubject<TemplatePortal | null > = new BehaviorSubject<TemplatePortal | null>(null);

  constructor(coreStore: AppStore, private deviceService: DeviceDetectorService) {
    coreStore.setUiState(deviceService.isMobile())
  }

  public setSubMenu(portal: TemplatePortal | null) {
    this.subMenu.next(portal);
  }

  public setHeaderMenu(portal: TemplatePortal | null) {
    this.headerMenu.next(portal);
  }
}
