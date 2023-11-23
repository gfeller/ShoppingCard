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
  enableIndexedDbPersistence,
  getFirestore,
  initializeFirestore,
  provideFirestore,
  persistentLocalCache,
  connectFirestoreEmulator, enableMultiTabIndexedDbPersistence
} from '@angular/fire/firestore';
import {environment} from '../../environments/environment';
import {GlobalErrorHandler} from './services/global-error.handler';
import {Store, StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from './state';
import {UiService} from './services/ui.service';
import {getMessaging, provideMessaging, getToken} from '@angular/fire/messaging';

import {connectFunctionsEmulator, getFunctions, provideFunctions} from '@angular/fire/functions';

console.log(environment.useEmulators);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
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
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ]
})
export class CoreModule {
  constructor(uiService: UiService, onlineService: OnlineService, authService: AuthService, msgService: MessagingService, store: Store) /*Eager*/ {
    msgService.init().then(x=>{
       console.log("Messaging ready")
    });
  }
}
