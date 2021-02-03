import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';

import {AuthConnect, AuthUser, AuthUserSettingsChange} from '../state/core/model';
import {defer, from, Observable} from 'rxjs';
import {CoreState} from '../state/core/reducer';
import {CoreActions} from '../state';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth, private  state: Store<CoreState>) {
    afAuth.onAuthStateChanged((user? : firebase.User) => {
      if (user === null) {
        afAuth.signInAnonymously();
      } else {
        state.dispatch(CoreActions.authChanged(new AuthUser(user)));
      }
    });
  }

  connectUser(data: AuthConnect): Observable<AuthUser> {
    return defer(async () => {
      const user = await this.afAuth.currentUser;
      const linkedUser = await user.linkWithCredential(firebase.auth.EmailAuthProvider.credential(data.email, data.pwd));

      return new AuthUser(linkedUser.user);
    });
  }

  login(data: AuthConnect): Observable<AuthUser> {
    return defer(async () => {
      await this.afAuth.signInWithEmailAndPassword(data.email, data.pwd);
      return new AuthUser(await this.afAuth.currentUser);
    });
  }

  async delete(data: AuthUserSettingsChange) {
    const cred = firebase.auth.EmailAuthProvider.credential(data.email, data.pwdOld);
    await (await this.afAuth.currentUser).reauthenticateWithCredential(cred);

    await (await this.afAuth.currentUser).delete();
    return this.afAuth.signInAnonymously();
  }

  resetPwdMail(email: string): Observable<any> {
    return from(this.afAuth.sendPasswordResetEmail(email));
  }

  changeUser(data: AuthUserSettingsChange): Observable<AuthUser> {
    return defer(async () => {
      const currentUser = await this.afAuth.currentUser;

      if (data.displayName !== currentUser.displayName) {
        await currentUser.updateProfile({displayName: data.displayName, photoURL: ''});
      }
      if (data.pwd && data.pwdOld) {
        const cred = firebase.auth.EmailAuthProvider.credential(data.email, data.pwdOld);
        await currentUser.reauthenticateWithCredential(cred);
        await currentUser.updatePassword(data.pwd);
      }
      return new AuthUser(await this.afAuth.currentUser);
    });
  }
}
