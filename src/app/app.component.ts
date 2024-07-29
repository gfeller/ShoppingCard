import {Component, effect} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UiService} from './core/services/ui.service';
import {AppStore} from "./core/state/app-store";
import {ListStore} from "./shoppinglist/state/list-store";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  template: `
    <ng-template [ngIf]="!(appStore.ready)" [ngIfElse]="loaded">
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    </ng-template>
    <ng-template #loaded>
      <div class="layout" [class.mobile]="appStore.isMobile()">
        <mat-toolbar class="toolbar">
      <span>
        <button mat-icon-button [routerLink]="['/']" style="position: relative;display: flex;align-items: center;">
          <mat-icon>home</mat-icon>
        </button>
      </span>
          <span style="margin-left: auto"></span>
          <div>
            <ng-container [cdkPortalOutlet]="uiService.headerMenu()"></ng-container>
          </div>
          <span style="margin-left: auto"></span>
          @if(appStore.user(); as user){
            <div style="display: flex; align-items: center">
              <button data-test-id="user-settings" mat-button [routerLink]="['/user']">
                @if(user.isAnonymous){
                  <div style="position: relative;display: flex;align-items: center;">
                    <mat-icon style="position: relative;transform: rotate(2.5rad)">link</mat-icon>
                    <mat-icon style="position: absolute;color: red;transform: scale(1.2,1.2);">not_interested</mat-icon>
                    <span data-test-id="user-name" style="margin-left: 5px">{{user?.uid?.substring(0, 10)}}</span>
                  </div>
                }
                @else{
                  <span data-test-id="user-name">{{user?.displayName || user?.email}}</span>
                }
              </button>
            </div>
          }
          <mat-icon>{{(appStore.online()) ? 'cloud_queue' : 'cloud_off'}}</mat-icon>
        </mat-toolbar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
        <ng-container [cdkPortalOutlet]="uiService.subMenu()"></ng-container>
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

  constructor(public appStore: AppStore,  public listStore: ListStore, public snackBar: MatSnackBar, public uiService : UiService, public router: Router) {
    effect(() => {
      const messages = appStore.messages();
      if (messages.length > 0 && !this.openSnackbar) {
        this.openSnackBar(messages[0], messages[0].message);
      }
    });
  }

  openSnackBar(errorObj: any, message: string, action?: string) { // TODO type
    this.openSnackbar = true;
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    }).afterDismissed().subscribe(() => {
      this.openSnackbar = false;
      this.appStore.removeMessage(errorObj.id)
    });
  }
}
