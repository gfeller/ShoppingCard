export class AuthUser {
  public uid: string;
  public isAnonymous: boolean;
  public email: string;
  public displayName: string;

  constructor({uid, isAnonymous, email, displayName}: { uid: string, isAnonymous: boolean, email: string | null, displayName: string | null}) {
    this.uid = uid;
    this.isAnonymous = isAnonymous;
    this.email = email || '';
    this.displayName = displayName || '';
  }
}


export interface AuthConnect {
  email: string;
  pwd: string;
}

export interface AuthUserSettingsChange extends AuthConnect {
  emailOld: string;
  pwdOld: string;
  displayName: string;
}

