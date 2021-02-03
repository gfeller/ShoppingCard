import {Injectable} from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/messaging';

import {AngularFireAuth} from '@angular/fire/auth';

import {Store} from '@ngrx/store';
import {defer, from, Observable} from 'rxjs';
import {take} from 'rxjs/operators';

import {AngularFirestore} from '@angular/fire/firestore';
import {CoreState} from '../state/core/reducer';
import * as CoreActions from '../state/core/actions';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private readonly messaging: firebase.messaging.Messaging;


  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private store: Store<CoreState>) {
    if (firebase.messaging && firebase.messaging.isSupported()) {
      this.messaging = firebase.messaging();
    }
  }


  updateToken(token) {
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }
      this.db.collection('fcmTokens').doc(user.uid).set({token});
    });
  }

  async removeToken(token) {
    await this.db.collection('fcmTokens').doc((await this.afAuth.currentUser).uid).delete();
  }

  getPermission() {
    if (this.messaging == null) {
      this.store.dispatch(CoreActions.notificationGrantNotExist());
      return;
    }
    this.messaging.getToken().then(token => {
      if (token) {
        this.updateToken(token);
        this.store.dispatch(CoreActions.notificationGrantExist({token}));
      } else {
        this.store.dispatch(CoreActions.notificationGrantNotExist());
      }
    });

    // it can be that the token gets refreshed => send the new token to the server
    // onTokenRefresh -> should be onNewToken but not available
    this.messaging.onTokenRefresh(value => {
      this.messaging.getToken()
        .then(token => this.updateToken(token));
    });
  }

  requestPermission() {
    return from(Notification.requestPermission()
      .then((value) => {
        if (value === 'default') {
          return Promise.reject(value);
        }
        if (value === 'denied') {
          this.store.dispatch(CoreActions.message({message: 'Benachrichtigen wurden permanent im Browser deaktiviert. Aktivieren Sie diese manuell.'}));
          return Promise.reject(value);
        }
        return this.messaging.getToken();
      })
      .then(token => {
        this.updateToken(token);
        this.store.dispatch(CoreActions.notificationGrantSuccess({token}));
        this.store.dispatch(CoreActions.message({message: 'Danke für Ihre Zustimmung'}));
      })
      .catch((err) => {
        this.store.dispatch(CoreActions.notificationGrantForbidden());
      }));
  }

  removePermission(token: string): Observable<void> {
    return defer(async () => {
      await this.messaging.deleteToken();
      return await this.removeToken(token);
    });
  }


  receiveMessage() {
    if (this.messaging != null) {
      this.messaging.onMessage((payload) => {
        this.store.dispatch(CoreActions.notificationSuccess(payload));
      });
    }
  }
}
