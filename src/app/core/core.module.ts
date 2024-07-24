import {ErrorHandler, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagingService} from './services/messaging.service';
import {OnlineService} from './services/online.service';
import {AuthService} from './services/auth.service';


import {
  browserPopupRedirectResolver,
  connectAuthEmulator,
  indexedDBLocalPersistence,
  initializeAuth,
  provideAuth
} from '@angular/fire/auth';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  provideFirestore
} from '@angular/fire/firestore';
import {environment} from '../../environments/environment';
import {GlobalErrorHandler} from './services/global-error.handler';
import {UiService} from './services/ui.service';
import {getMessaging, getToken, provideMessaging} from '@angular/fire/messaging';

import {connectFunctionsEmulator, getFunctions, provideFunctions} from '@angular/fire/functions';
import {AppStore} from "./state/core/app-store";
import {preLoadApp} from "./services/bootstrapper";

console.log(environment.useEmulators);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    preLoadApp,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideMessaging(() => {
      const messsage = getMessaging();
      getToken(messsage, {vapidKey: "BDVuY72ImQjzouaS9SpWPaORCPqOl72AszG8dtFCVmhFrQscoGwOqVDe50AMIak9hbMIhXpHrJceD_5ANB0oVRc"})
      return messsage;
    }),
    provideFirestore(() => {
      const fireStore =  initializeFirestore(getApp(), {localCache: persistentLocalCache({})});;
      if (environment.useEmulators) {
        connectFirestoreEmulator(fireStore, 'localhost', 8080);
      }
      return fireStore;
    }),
    provideAuth(() => {
      const auth = initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence,
        popupRedirectResolver: browserPopupRedirectResolver,
      });
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: true});
      }
      return auth;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
  ]
})
export class CoreModule {

}
