import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';

import {CoreState} from '../state/core/reducer';
import * as CoreActions from '../state/core/actions';
import {uiInformationChanged} from '../state/core/actions';
import {State} from '../state';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Template} from '@angular/compiler/src/render3/r3_ast';
import {TemplatePortal} from '@angular/cdk/portal';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UiService {

  public subMenu: BehaviorSubject<TemplatePortal> = new BehaviorSubject<TemplatePortal>(null);
  public headerMenu: BehaviorSubject<TemplatePortal> = new BehaviorSubject<TemplatePortal>(null);

  constructor(private coreStore: Store<State>, private deviceService: DeviceDetectorService) {
    coreStore.dispatch(uiInformationChanged({info: {isMobile: deviceService.isMobile()}}));

    /*
    window.addEventListener('resize', (event) => {
      coreStore.dispatch(uiInformationChanged({info: {isMobile: deviceService.isMobile()}}));
    });*/
  }

  public setSubMenu(portal: TemplatePortal) {
    this.subMenu.next(portal);
  }

  public setHeaderMenu(portal: TemplatePortal) {
    this.headerMenu.next(portal);
  }
}
