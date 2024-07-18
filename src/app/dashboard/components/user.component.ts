import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {Observable} from 'rxjs';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthConnect, AuthUser} from '../../core/state/core/model';
import {selectNotificationToken, selectUser, State} from '../../core/state';
import * as CoreActions from '../../core/state/core/actions';
import {MessagingService} from "../../core/services/messaging.service";


@Component({
  selector: 'app-user',
  template: `
    <ng-template [ngIf]="user">
      <div style="display: flex; align-items: center; justify-content: center">
        <div style="max-width: 700px">
          <mat-card *appOnlyUser>
            <mat-card-header>
              Benutzer Informationen
            </mat-card-header>
            <mat-card-content>
              <form id="profile-form" [formGroup]="changeUserData" novalidate (ngSubmit)="onChange()" autocomplete="off">
                <mat-form-field>
                  <mat-label>E-Mail</mat-label>
                  <input matInput [value]="user.email" disabled>
                </mat-form-field>
                <mat-form-field>
                  <mat-label>Anzeigename</mat-label>
                  <input formControlName="displayName" matInput placeholder="Anzeigename" type="text">
                </mat-form-field>
              </form>
            </mat-card-content>
            <mat-card-actions>
              <button form="profile-form" mat-button type="submit">Änderungen übernehmen</button>
            </mat-card-actions>
          </mat-card>

          <mat-card *appOnlyUser>
            <mat-card-header>
              Password Ändern
            </mat-card-header>
            <mat-card-content>
              <form id="formPwd" [formGroup]="changeUserData" novalidate (ngSubmit)="onChange()" autocomplete="off">
                <mat-form-field>
                  <mat-label>Passwort Alt</mat-label>
                  <input formControlName="pwd" matInput type="password" autocomplete="off">
                </mat-form-field>
                <mat-form-field>
                  <mat-label>Passwort Neu</mat-label>
                  <input formControlName="pwdOld" matInput type="password" autocomplete="off">
                </mat-form-field>
              </form>
            </mat-card-content>
            <mat-card-actions>
              <button form="formPwd" mat-button type="submit" [disabled]="!(changeUserData.valid && changeUserData.touched)">
                Passwort wechseln
              </button>
            </mat-card-actions>
          </mat-card>


          <mat-card *appOnlyAnonymous data-test-id="anonymous-login-card">
            <mat-card-header>
              Dieser Account ist nicht mit einer E-Mail verbunden. Listen können verloren gehen!
              Sie können ihren Account mit einem neuem Account verbinden oder sich mit einem bestehemden Account anmelden.
            </mat-card-header>
            <mat-card-content>
              <form id="formRegister" [formGroup]="connectUserData" novalidate>
                <mat-form-field>
                  <input formControlName="email" matInput placeholder="E-Mail" type="email">
                </mat-form-field>
                <mat-form-field>
                  <input formControlName="pwd" matInput placeholder="Passwort" type="password">
                </mat-form-field>
                <button mat-flat-button type="submit" (click)="onSubmit(connectUserData.value, true)">
                  Neuer Account erstellen
                </button>
                <button mat-flat-button (click)="onSubmit(connectUserData.value, false)">Anmelden</button>
              </form>
            </mat-card-content>
            <mat-card-actions>
              <button form="formRegister" mat-flat-button (click)="onSubmit(connectUserData.value, false)">Anmelden</button>
            </mat-card-actions>

          </mat-card>

          <mat-card>
            <mat-card-header>
              Passwort vergessen?
            </mat-card-header>
            <mat-card-content>
              <form id="formReset" [formGroup]="pwdResetData" novalidate (ngSubmit)="onReset()">
                <mat-form-field *appOnlyAnonymous>
                  <input formControlName="email" matInput placeholder="E-Mail" type="email">
                </mat-form-field>
              </form>
            </mat-card-content>
            <mat-card-actions>
              <button form="formReset" mat-flat-button type="submit">Passwort zurücksetzten</button>
            </mat-card-actions>
          </mat-card>

          <mat-card>
            <mat-card-header>
              Push-Nachrichten
            </mat-card-header>
            <mat-card-content>
              <ng-template [ngIf]="notificationToken">
                <p>Push Nachrichten sind aktiviert.</p>
                <p>
                  Sie erhalten Nachrichten falls neue Einträge hinzugefügt werden.
                </p>
              </ng-template>
              <ng-template [ngIf]="!notificationToken">
                <p>Push Nachrichten sind deaktiviert. {{notificationToken}}</p>
                <p>
                  Sie können Push-Nachrichten aktivieren. Sie werden benachrichtet wenn neue Einträge erfasst werden.
                </p>
              </ng-template>
            </mat-card-content>
            <mat-card-actions>
              <ng-template [ngIf]="notificationToken">
                <button mat-flat-button type="submit" (click)="onRemoveNotification()">Keine Benachrichtungen mehr erhalten.
                </button>
              </ng-template>
              <ng-template [ngIf]="!notificationToken">
                <button mat-flat-button type="submit" (click)="onAddNotification()">Benachrichtungen aktivieren.</button>
              </ng-template>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </ng-template>
  `,
  styles: `
    .label-container {
      display: flex;
      align-items: center;
    }

    mat-card {
      margin: 1rem;
    }
  `
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
  public notificationToken: string | null;


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
    this.store.dispatch(CoreActions.removeNotificationGrant({token: this.notificationToken!}));
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
              [notificationToken]="notificationToken$ | async"></app-user>
  `,
})
export class UserPageComponent implements OnInit {
  public user$: Observable<AuthUser> = new Observable<AuthUser>();
  public notificationToken$: Observable<string | null> = new Observable<string | null>();

  constructor(private store: Store<State>) {
    this.user$ = store.select(selectUser);
    this.notificationToken$ = store.select(selectNotificationToken);
  }

  ngOnInit() {
  }
}
