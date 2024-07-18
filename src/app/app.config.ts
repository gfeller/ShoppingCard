import { ApplicationConfig, isDevMode, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {
  browserPopupRedirectResolver,
  connectAuthEmulator,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  provideAuth
} from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  provideFirestore
} from '@angular/fire/firestore';
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import {getMessaging, getToken, provideMessaging} from "@angular/fire/messaging";


export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideAnimations(),

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideMessaging(() => {
      const messsage = getMessaging();
      getToken(messsage, {vapidKey: "BDVuY72ImQjzouaS9SpWPaORCPqOl72AszG8dtFCVmhFrQscoGwOqVDe50AMIak9hbMIhXpHrJceD_5ANB0oVRc"})
      return messsage;
    }),
    provideFirestore(() => {
      const fireStore = initializeFirestore(getApp(), {localCache: persistentLocalCache({})});
      ;
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
};
