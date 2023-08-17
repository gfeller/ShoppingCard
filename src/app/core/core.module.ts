import {ErrorHandler, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagingService} from './services/messaging.service';
import {OnlineService} from './services/online.service';
import {AuthService} from './services/auth.service';


import {browserPopupRedirectResolver, indexedDBLocalPersistence, initializeAuth, provideAuth} from '@angular/fire/auth';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {enableIndexedDbPersistence, getFirestore, initializeFirestore, provideFirestore, persistentLocalCache} from '@angular/fire/firestore';
import {environment} from '../../environments/environment';
import {GlobalErrorHandler} from './services/global-error.handler';
import {Store, StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from './state';
import {UiService} from './services/ui.service';
import {getMessaging, provideMessaging} from '@angular/fire/messaging';


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
    provideMessaging(() => getMessaging()),
    provideFirestore(() => {
      return initializeFirestore(getApp(), {localCache: persistentLocalCache({})});
    }),
    provideAuth(() => {
      return initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence,
        popupRedirectResolver: browserPopupRedirectResolver,
      });
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
