import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';
import {uiInformationChanged} from '../state/core/actions';
import {State} from '../state';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TemplatePortal} from '@angular/cdk/portal';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UiService {

  public subMenu: BehaviorSubject<TemplatePortal | null> = new BehaviorSubject<TemplatePortal | null>(null);
  public headerMenu: BehaviorSubject<TemplatePortal | null > = new BehaviorSubject<TemplatePortal | null>(null);

  constructor(private coreStore: Store<State>, private deviceService: DeviceDetectorService) {
    coreStore.dispatch(uiInformationChanged({info: {isMobile: deviceService.isMobile()}}));
  }

  public setSubMenu(portal: TemplatePortal | null) {
    this.subMenu.next(portal);
  }

  public setHeaderMenu(portal: TemplatePortal | null) {
    this.headerMenu.next(portal);
  }
}
