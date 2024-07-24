import {APP_INITIALIZER} from "@angular/core";
import {UiService} from "./ui.service";
import {OnlineService} from "./online.service";
import {AuthService} from "./auth.service";
import {MessagingService} from "./messaging.service";
import {AppStore} from "../state/core/app-store";

export function preloadUser(uiService: UiService, onlineService: OnlineService, authService: AuthService, msgService: MessagingService, appStore: AppStore) {
  return async function() {
    await appStore.init();
  };
}

export const preLoadApp = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: preloadUser,
  deps: [UiService, OnlineService, AuthService, MessagingService, AppStore]
};
