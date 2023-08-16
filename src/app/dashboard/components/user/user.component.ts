import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {Observable} from 'rxjs';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthConnect, AuthUser} from '../../../core/state/core/model';
import {selectNotificationToken, selectUser, State} from '../../../core/state';
import * as CoreActions from '../../../core/state/core/actions';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  private _user!: AuthUser;
  public connectUserData!: FormGroup;
  public pwdResetData!: FormGroup;
  public changeUserData!: FormGroup;

  @Input()
  public set user(value: AuthUser) {
    this._user = value;
    this.ngOnInit();
  }

  public get user() {
    return this._user;
  }


  @Input()
  public notificationToken!: string;


  constructor(private fb: FormBuilder, private store: Store<State>) {

  }

  onChange() {
    const data = this.changeUserData.getRawValue();
    data.pwd = this.changeUserData.controls["pwd"].dirty ? data.pwd : undefined;
    if (this.changeUserData.valid) {
      this.store.dispatch(CoreActions.authUserSettingsChanged(data));
    }
  }

  onSubmit(user: AuthConnect, isNew: boolean) {
    if (isNew) {
      this.store.dispatch(CoreActions.authConnect(user));
    } else {
      this.store.dispatch(CoreActions.authLogin(user));
    }
  }

  onReset() {
    this.store.dispatch(CoreActions.authResetPwd({email: this.pwdResetData.value.email}));
    this.ngOnInit();
  }

  onRemoveNotification() {
    this.store.dispatch(CoreActions.removeNotificationGrant({token: this.notificationToken}));
  }

  onAddNotification() {
    this.store.dispatch(CoreActions.notificationGrantRequest());
  }

  ngOnInit() {
    this.connectUserData = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      pwd: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.pwdResetData = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]]
    });

    this.changeUserData = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      pwd: ['', [Validators.minLength(6)]],
      pwdOld: ['', [Validators.minLength(6)]],
      displayName: [this.user.displayName],
    });
  }
}

@Component({
  selector: 'app-user-page',
  template: `
    <app-user *ngIf="user$ | async | notNull" [user]="user$ | async | notNull"
              [notificationToken]="notificationToken$ | async | notNull"></app-user>
  `,
})
export class UserPageComponent implements OnInit {
  public user$: Observable<AuthUser> = new Observable<AuthUser>();
  public notificationToken$: Observable<string> = new Observable<string>();

  constructor(private store: Store<State>) {
    this.user$ = store.select(selectUser);
    this.notificationToken$ = store.select(selectNotificationToken);
  }

  ngOnInit() {
  }
}
