import {Injectable} from '@angular/core';
import {deleteToken, getMessaging, getToken, isSupported, Messaging, onMessage} from 'firebase/messaging';
import 'firebase/messaging';

import {Auth, authState} from '@angular/fire/auth';
import {collection, deleteDoc, doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore';

import {Store} from '@ngrx/store';
import {defer, from, Observable} from 'rxjs';
import {take} from 'rxjs/operators';

import {CoreState} from '../state/core/reducer';
import * as CoreActions from '../state/core/actions';
import {NotificationData} from "../state/core/actions";


@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private messaging: Messaging | undefined;

  constructor(private db: Firestore, private afAuth: Auth, private store: Store<CoreState>) {

  }

  async init(){
    if(await isSupported()) {
      this.messaging = getMessaging();

      const token = await this.getToken();
      if (token) {
        this.store.dispatch(CoreActions.notificationGrantExist({token: token}))
      }

      this.receiveMessage()
    }

    this.store.dispatch(CoreActions.initSuccessMessaging())
  }

  updateToken(token: string) {
    authState(this.afAuth).pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }
      setDoc(doc(collection(this.db, 'fcmTokens'), user.uid), {token});
    });
  }


  async getToken() {
    return getToken(this.messaging!).catch(x => undefined);
  }


  async removeToken() {
    const user = await this.afAuth.currentUser!;
    await deleteDoc(doc(collection(this.db, 'fcmTokens'), user.uid));
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
        return getToken(this.messaging!);
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

  removePermission(): Observable<void> {
    return defer(async () => {
      await deleteToken(this.messaging!);
      return await this.removeToken();
    });
  }


  receiveMessage() {
    if (this.messaging != null) {
      onMessage(this.messaging, (payload: unknown) => {
        this.store.dispatch(CoreActions.notificationSuccess(payload as NotificationData));
      });
    }
  }
}
