import {Component, effect, inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UiService} from './core/services/ui.service';
import {AppStore} from './core/state/app-store';
import {ListStore} from './shoppinglist/state/list-store';
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  template: `
    @if (appStore.ready()) {
      <div class="layout" [class.mobile]="appStore.isMobile()">
        <app-header class="toolbar" [user]="appStore.user()!"></app-header>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
        <ng-container [cdkPortalOutlet]="uiService.subMenu()"></ng-container>
      </div>
    } @else {
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    }
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
    }
  `
})
export class AppComponent {
  private openSnackbar = false;

  appStore = inject(AppStore)
  snackBar = inject(MatSnackBar)
  uiService = inject(UiService)
  router = inject(Router)

  constructor() {
    effect(() => {
      const messages = this.appStore.messages();
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
      this.appStore.removeMessage(errorObj.id);
    });
  }
}
