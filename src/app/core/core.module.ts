import {ErrorHandler, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


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
import {getMessaging, provideMessaging} from '@angular/fire/messaging';

import {connectFunctionsEmulator, getFunctions, provideFunctions} from '@angular/fire/functions';
import {preLoadApp} from "./services/bootstrapper";
import {UserComponent} from "./components/user.component";
import {MaterialModule} from "../shared/material.module";
import {ReactiveFormsModule} from "@angular/forms";

console.log(environment.useEmulators);

@NgModule({
  declarations: [ UserComponent],
  exports: [UserComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
    preLoadApp,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideMessaging(() => {
      return getMessaging();
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
