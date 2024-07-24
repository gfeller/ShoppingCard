import {patchState, signalStore, withState} from "@ngrx/signals";
import {withDevtools} from "@angular-architects/ngrx-toolkit";

import {inject, Injectable} from "@angular/core";
import {AuthConnect, AuthUser, AuthUserSettingsChange} from "./model";
import {MessagingService, NotificationData} from "../../services/messaging.service";
import {AuthService} from "../../services/auth.service";

export interface AppState {
  online: boolean;
  user: AuthUser | null;
  messages: { id: string, message: string}[];
  notifications: NotificationData[];
  notificationAccess:  boolean | null;
  isMobile: boolean;
  auth: boolean,
  messaging: boolean,
  ready: boolean
}

export const initialState: AppState = {
  online: navigator.onLine,
  user: null,
  messages: [],
  notifications: [],
  notificationAccess: null,
  isMobile: true,
  auth: false,
  messaging: false,
  ready: false,
};

@Injectable({providedIn: "root"})
export class AppStore extends signalStore(  { providedIn: 'root' },
  withDevtools('app'),
  withState<AppState>(initialState)){

  messagingService = inject(MessagingService)
  authService = inject(AuthService)

  constructor() {
    super();

    this.messagingService.onMessage.subscribe(this.addNotification.bind(this));
    this.authService.onChange.subscribe(this.#authChanged.bind(this))
  }

  async init(){
    await this.messagingService.init()
    await this.authService.init()
  }

  setNetState(online: boolean){
    patchState(this, {online: online});
  }

  setUiState(isMobile: boolean){
    patchState(this, {isMobile:isMobile});
  }



  addNotification(data: NotificationData){
    patchState(this, {notifications: [...this.notifications(), data]});
  }

  removeNotification(data: NotificationData) {
    patchState(this, {notifications: this.notifications().filter(n => n.data.containerId !== data.data.containerId && n.data.targetId !== data.data.targetId)});
  }

  addMessage(message: string){
    patchState(this, {messages: [...this.messages(), {id : crypto.randomUUID(), message: message}]});
  }

  removeMessage(id: string) {
    patchState(this, {messages: this.messages().filter(x => x.id !== id)});
  }

  async connect(data: AuthConnect){
    this.#authChanged(await this.authService.connectUser(data))
  }

  login(data: AuthConnect){
    this.authService.login(data)
  }

  async resetPwdMail(mail: string){
    await this.authService.resetPwdMail(mail);
    this.addMessage('E-Mail wurde versendet')
  }

  async authUserSettingsChange(data: AuthUserSettingsChange){
    this.#authChanged(await this.authService.changeUser(data))
    this.addMessage('Änderung übernommen')
  }

  #authChanged(user: AuthUser){
    patchState(this, {user: user});
  }

  async requestPermission(){
    const result = await this.messagingService.requestPermission();
    patchState(this, {notificationAccess: result.permission});
    if(result.message) {
      this.addMessage(result.message)
    }
  }

  async removePermission() {
    await this.messagingService.removePermission();
    patchState(this, {notificationAccess: false});
    this.addMessage("Erfolgreich abgemeldet.'")
  }
}
