import {EventEmitter, Injectable} from '@angular/core';
import {deleteToken, getMessaging, getToken, isSupported, Messaging, onMessage} from 'firebase/messaging';
import 'firebase/messaging';

import {Auth, authState} from '@angular/fire/auth';
import {collection, deleteDoc, doc, Firestore, setDoc} from '@angular/fire/firestore';

import {take} from 'rxjs/operators';

import {environment} from '../../../environments/environment';


export interface NotificationData {
  data: { type: string, targetId: string, containerId: string };
  notification: { title: string, body: string, icon?: string };
  collapseKey: string;
  from: string;
}

export interface RemoveNotification {
  targetId?: string;
  containerId?: string;
}


@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private messaging: Messaging | undefined;

  onMessage = new EventEmitter<NotificationData>()


  constructor(private db: Firestore, private afAuth: Auth) {

  }

  async init(){
    if(await isSupported()) {
      this.messaging = getMessaging();

      await this.#getTokenAndSendToServer();

      this.#receiveMessage()
      return false;
    }
    return false;
  }


  requestPermission = async () : Promise<{permission: boolean, message?: string}> => {
    return Notification.requestPermission()
      .then((value: string) => {
        if (value === "default" || value === "denied") {
          return Promise.reject(value);
        }
        return getToken(this.messaging!);
      })
      .then((token) => {
        this.#updateToken(token);
      })
      .catch(x => undefined)
      .then(() => {
        if (Notification.permission === "denied") {
          return {
            permission: false,
            "message": "Benachrichtigen wurden permanent im Browser deaktiviert. Aktivieren Sie diese manuell."
          }
        } else if (Notification.permission === "default") {
          return {permission: false}
        }
        return {permission: false, "message": "Danke für Ihre Zustimmung."}
      })
  };


  async removePermission() {
    await deleteToken(this.messaging!);
    return await this.#removeToken();
  }


  #updateToken(token: string) {
    authState(this.afAuth).pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }
      setDoc(doc(collection(this.db, 'fcmTokens'), user.uid), {token});
    });
  }


  async #removeToken() {
    const user = await this.afAuth.currentUser!;
    await deleteDoc(doc(collection(this.db, 'fcmTokens'), user.uid));
  }

  async #getTokenAndSendToServer() {
    const token = await getToken(this.messaging!, {vapidKey: environment.vapidKey})
    if(token) {
      this.#updateToken(token);
    }
  }


  #receiveMessage() {
    if (this.messaging != null) {
      onMessage(this.messaging, (payload: unknown) => {
        this.onMessage.emit(payload as NotificationData);
      });
    }
  }
}
