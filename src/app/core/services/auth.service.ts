import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';
import {
  Auth,
  deleteUser,
  linkWithCredential,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile
} from '@angular/fire/auth';


import {EmailAuthProvider, User} from 'firebase/auth';

import {AuthConnect, AuthUser, AuthUserSettingsChange} from '../state/core/model';
import {defer, from, Observable} from 'rxjs';
import {CoreState} from '../state/core/reducer';
import {CoreActions} from '../state';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public afAuth: Auth, private state: Store<CoreState>) {
    afAuth.onAuthStateChanged((user) => {
      if (user === null) {
        signInAnonymously(this.afAuth);
      } else {
        state.dispatch(CoreActions.initSuccessAuth())
        state.dispatch(CoreActions.authChanged(new AuthUser(user)));
      }
    });
  }

  connectUser(data: AuthConnect): Observable<AuthUser> {
    return defer(async () => {
      const user = await this.afAuth.currentUser!;
      const linkedUser = await linkWithCredential(user, EmailAuthProvider.credential(data.email, data.pwd));

      return new AuthUser(linkedUser.user);
    });
  }

  login(data: AuthConnect): Observable<AuthUser> {
    return defer(async () => {
      await signInWithEmailAndPassword(this.afAuth, data.email, data.pwd);
      return new AuthUser((await this.afAuth.currentUser)!);
    });
  }

  async delete(data: AuthUserSettingsChange) {
    const cred = EmailAuthProvider.credential(data.email, data.pwdOld);
    const user = await this.afAuth.currentUser!;

    await reauthenticateWithCredential(user, cred);
    await deleteUser(user);

    return signInAnonymously(this.afAuth);
  }

  resetPwdMail(email: string): Observable<any> {
    return from(sendPasswordResetEmail(this.afAuth, email));
  }

  changeUser(data: AuthUserSettingsChange): Observable<AuthUser> {
    return defer(async () => {
      const currentUser = await this.afAuth.currentUser!;

      if (data.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, {displayName: data.displayName, photoURL: ''});
      }
      if (data.pwd && data.pwdOld) {
        const cred = EmailAuthProvider.credential(data.email, data.pwdOld);
        await reauthenticateWithCredential(currentUser, cred);
        await updatePassword(currentUser, data.pwd);
      }
      return new AuthUser(await this.afAuth.currentUser!);
    });
  }
}
