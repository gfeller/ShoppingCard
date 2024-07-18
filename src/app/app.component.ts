import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthUser} from './core/state/core/model';
import {Store} from '@ngrx/store';
import {selectIsMobile, selectIsOnline, selectIsReady, selectMessages, selectUser, State} from './core/state';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as CoreActions from './core/state/core/actions';
import {UiService} from './core/services/ui.service';

@Component({
  selector: 'app-root',
  template: `
    <ng-template [ngIf]="!(ready$ | async)" [ngIfElse]="loaded">
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    </ng-template>
    <ng-template #loaded>
      <div class="layout" [class.mobile]="isMobile$ | async">
        <mat-toolbar class="toolbar">
      <span>
        <button mat-icon-button [routerLink]="['/']" style="position: relative;display: flex;align-items: center;">
          <mat-icon>home</mat-icon>
        </button>
      </span>
          <span style="margin-left: auto"></span>
          <div>
            <ng-container [cdkPortalOutlet]="uiService.headerMenu | async"></ng-container>
          </div>
          <span style="margin-left: auto"></span>
          <div *ngIf="user$ | async as user" style="display: flex; align-items: center">
            <button data-test-id="user-settings" mat-button [routerLink]="['/user']">
              <ng-template [ngIf]="user.isAnonymous">
                <div style="position: relative;display: flex;align-items: center;">
                  <mat-icon style="position: relative;transform: rotate(2.5rad)">link</mat-icon>
                  <mat-icon style="position: absolute;color: red;transform: scale(1.2,1.2);">not_interested</mat-icon>
                  <span data-test-id="user-name" style="margin-left: 5px">{{user?.uid?.substring(0, 10)}}</span>
                </div>
              </ng-template>
              <ng-template [ngIf]="!user.isAnonymous">
                <span data-test-id="user-name">{{user?.displayName || user?.email}}</span>
              </ng-template>
            </button>
          </div>
          <mat-icon>{{(isOnline$ | async) ? 'cloud_queue' : 'cloud_off'}}</mat-icon>
        </mat-toolbar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
        <ng-container [cdkPortalOutlet]="uiService.subMenu | async"></ng-container>
      </div>
    </ng-template>
  `,
  styles: `
    .layout {
      display: grid;
      grid-template-areas:
    "toolbar"
    "content"
    "subMenu";

      grid-template-rows: auto 1fr auto;
      height: 100vh;
      max-height: 100vh;
    }

    .toolbar {
      grid-area: toolbar;
    }

    .content {
      overflow: auto;
      grid-area: content;
    }

    .subMenu {
      grid-area: subMenu;
      background: red;
    }
  `
})
export class AppComponent {
  private openSnackbar = false;

  isOnline$: Observable<boolean>;
  isMobile$: Observable<boolean>;
  ready$: Observable<boolean>;
  user$: Observable<AuthUser | null | undefined>;


  constructor(private store: Store<State>, public snackBar: MatSnackBar, public uiService : UiService) {
    this.isOnline$ = store.select(selectIsOnline);
    this.isMobile$ = store.select(selectIsMobile)
    this.user$ = store.select(selectUser);
    this.ready$ = store.select(selectIsReady);


    store.select(selectMessages).subscribe(messages => {
      if (messages.length > 0 && !this.openSnackbar) {
        this.openSnackBar(messages[0], messages[0].message);
      }
    });
  }

  openSnackBar(errorObj: any, message: string, action?: string) {
    this.openSnackbar = true;
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    }).afterDismissed().subscribe(() => {
      this.openSnackbar = false;
      this.store.dispatch(CoreActions.removeMessage({item : errorObj}));
    });
  }
}
