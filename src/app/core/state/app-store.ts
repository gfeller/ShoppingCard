import {patchState, signalStore, withHooks, withMethods, withState} from '@ngrx/signals';
import {withDevtools} from '@angular-architects/ngrx-toolkit';

import {inject, Injectable} from '@angular/core';
import {AuthConnect, AuthUser, AuthUserSettingsChange} from '../model/auth';
import {MessagingService, NotificationData, RemoveNotification} from '../services/messaging.service';
import {AuthService} from '../services/auth.service';

export interface AppState {
  online: boolean;
  user: AuthUser | null;
  messages: { id: string, message: string }[];
  notifications: NotificationData[];
  notificationAccess: boolean | null;
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

export const AppStore = signalStore({providedIn: 'root'},
  withDevtools('app'),
  withState<AppState>(initialState),
  withMethods(((state, messagingService = inject(MessagingService), authService = inject(AuthService)) => ({
      async init() {
        const notificationAccess = await messagingService.init();
        patchState(state, {notificationAccess: notificationAccess});
        await authService.init();
        patchState(state, {ready: true});
      },
      setNetState(online: boolean) {
        patchState(state, {online: online});
      },

      setUiState(isMobile: boolean) {
        patchState(state, {isMobile: isMobile});
      },

      addNotification(data: NotificationData) {
        patchState(state, {notifications: [...state.notifications(), data]});
      },

      removeNotification(data: RemoveNotification) {
        patchState(state, {notifications: state.notifications().filter(n => n.data.containerId !== data.containerId && n.data.targetId !== data.targetId)});
      },

      addMessage(message: string) {
        patchState(state, {messages: [...state.messages(), {id: crypto.randomUUID(), message: message}]});
      },

      removeMessage(id: string) {
        patchState(state, {messages: state.messages().filter(x => x.id !== id)});
      },

      async connect(data: AuthConnect) {
        this._authChanged(await authService.connectUser(data));
      },

      login(data: AuthConnect) {
        authService.login(data);
      },

      async resetPwdMail(mail: string) {
        await authService.resetPwdMail(mail);
        this.addMessage('E-Mail wurde versendet');
      },

      async authUserSettingsChange(data: AuthUserSettingsChange) {
        this._authChanged(await authService.changeUser(data));
        this.addMessage('Änderung übernommen');
      },
      _authChanged(user: AuthUser) {
        patchState(state, {user: user});
      },

      async requestPermission() {
        const result = await messagingService.requestPermission();
        patchState(state, {notificationAccess: result.permission});
        if (result.message) {
          this.addMessage(result.message);
        }
      },

      async removePermission() {
        await messagingService.removePermission();
        patchState(state, {notificationAccess: false});
        this.addMessage('Erfolgreich abgemeldet.\'');
      },

    })
  )),
  withHooks({
    onInit(store, messagingService = inject(MessagingService), authService = inject(AuthService)) {
      messagingService.onMessage.subscribe(store.addNotification.bind(this));
      authService.onChange.subscribe(store._authChanged.bind(this));
    }
  }),
);
export type AppStore = InstanceType<typeof AppStore>;
