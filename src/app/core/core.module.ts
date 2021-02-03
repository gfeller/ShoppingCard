import {ErrorHandler, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagingService} from './services/messaging.service';
import {OnlineService} from './services/online.service';
import {AuthService} from './services/auth.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {GlobalErrorHandler} from './services/global-error.handler';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from './state';


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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ]
})
export class CoreModule {
  constructor(onlineService: OnlineService, authService: AuthService, msgService: MessagingService) /*Eager*/ {
    msgService.getPermission();
    msgService.receiveMessage();
  }
}
