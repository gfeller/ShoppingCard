import {Component, computed, effect} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthConnect} from '../../core/state/core/model';
import {AppStore} from "../../core/state/core/app-store";


@Component({
  selector: 'app-user',
  template: `
    <ng-template [ngIf]="user()">
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
                  <input matInput [value]="user().email" disabled>
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
              <ng-template [ngIf]="">
                <p>Push Nachrichten sind aktiviert.</p>
                <p>
                  Sie erhalten Nachrichten falls neue Einträge hinzugefügt werden.
                </p>
              </ng-template>
              <ng-template [ngIf]="!appStore.notificationAccess">
                <p>Push Nachrichten sind deaktiviert.</p>
                <p>
                  Sie können Push-Nachrichten aktivieren. Sie werden benachrichtet wenn neue Einträge erfasst werden.
                </p>
              </ng-template>
            </mat-card-content>
            <mat-card-actions>
              <ng-template [ngIf]="appStore.notificationAccess">
                <button mat-flat-button type="submit" (click)="onRemoveNotification()">Keine Benachrichtungen mehr erhalten.
                </button>
              </ng-template>
              <ng-template [ngIf]="!appStore.notificationAccess">
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
export class UserComponent {
  public connectUserData!: FormGroup;
  public pwdResetData!: FormGroup;
  public changeUserData!: FormGroup;

  user = computed(() => this.appStore.user()!)

  constructor(private fb: FormBuilder, public appStore: AppStore) {
    effect(() => {
      if(appStore.user()){
        this.setFormData()
      }
    });

  }

  onChange() {
    const data = this.changeUserData.getRawValue();
    data.pwd = this.changeUserData.controls["pwd"].dirty ? data.pwd : undefined;
    if (this.changeUserData.valid) {
      this.appStore.authUserSettingsChange(data)
    }
  }

  onSubmit(user: AuthConnect, isNew: boolean) {
    if (isNew) {
      this.appStore.connect(user)
    } else {
      this.appStore.login(user)
    }
  }

  async onReset() {
    await this.appStore.resetPwdMail(this.pwdResetData.value.email)
    this.setFormData();
  }

  onRemoveNotification() {
    this.appStore.removePermission()
  }

  onAddNotification() {
    this.appStore.requestPermission()
  }

  setFormData() {
    this.connectUserData = this.fb.group({
      email: [this.user().email, [Validators.required, Validators.email]],
      pwd: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.pwdResetData = this.fb.group({
      email: [this.user().email, [Validators.required, Validators.email]]
    });

    this.changeUserData = this.fb.group({
      email: [this.user().email, [Validators.required, Validators.email]],
      pwd: ['', [Validators.minLength(6)]],
      pwdOld: ['', [Validators.minLength(6)]],
      displayName: [this.user().displayName],
    });
  }
}
