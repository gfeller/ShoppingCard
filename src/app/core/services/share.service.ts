import {inject, Injectable} from '@angular/core';
import {AppStore} from "../state/core/app-store";


@Injectable({
  providedIn: 'root'
})
export class ShareService {
  appStore = inject(AppStore)


  share(message: string, url: string) {
    navigator.share({title: 'ShoppingCard',text: message, url})
      .then(_ => this.appStore.addMessage('Wurde erfolgreich geteilt.'))
      .catch(error => this.appStore.addMessage('Wurde nicht geteilt.'));
  }
}
