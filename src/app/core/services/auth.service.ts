import {EventEmitter, Injectable} from '@angular/core';

import {
  Auth,
  deleteUser,
  linkWithCredential,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile, user
} from '@angular/fire/auth';


import {EmailAuthProvider} from 'firebase/auth';

import {AuthConnect, AuthUser, AuthUserSettingsChange} from '../state/core/model';
import {from, lastValueFrom, switchMap} from "rxjs";
import {take} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  onChange = new EventEmitter<AuthUser>()

  constructor(public afAuth: Auth) {

  }

  async init(){
    this.afAuth.onAuthStateChanged((user) => {
      if (user === null) {
        signInAnonymously(this.afAuth);
      } else {
        this.onChange.emit(new AuthUser(user))
      }
    });
    await lastValueFrom(user(this.afAuth).pipe(take(1)));
  }


  async connectUser(data: AuthConnect){
    const user = await this.afAuth.currentUser!;
    const linkedUser = await linkWithCredential(user, EmailAuthProvider.credential(data.email, data.pwd));

    return new AuthUser(linkedUser.user);
  }

  async login(data: AuthConnect) {
    await signInWithEmailAndPassword(this.afAuth, data.email, data.pwd);
    return new AuthUser((await this.afAuth.currentUser)!);
  }

  async delete(data: AuthUserSettingsChange) {
    const cred = EmailAuthProvider.credential(data.email, data.pwdOld);
    const user = await this.afAuth.currentUser!;

    await reauthenticateWithCredential(user, cred);
    await deleteUser(user);

    return signInAnonymously(this.afAuth);
  }

  async resetPwdMail(email: string) {
    return sendPasswordResetEmail(this.afAuth, email);
  }

  async changeUser(data: AuthUserSettingsChange) {
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
  }
}
