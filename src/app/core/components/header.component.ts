import {Component, effect, inject, input} from '@angular/core';
import {AuthUser} from '../model/auth';
import {AppStore} from '../state/app-store';
import {ListStore} from '../../shoppinglist/state/list-store';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UiService} from '../services/ui.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  template: `
    <mat-toolbar class="toolbar">
      <div>
        <button mat-icon-button [routerLink]="['/']" style="position: relative;display: flex;align-items: center;">
          <mat-icon>home</mat-icon>
        </button>
      </div>

      <div style="margin-left: auto; margin-right: auto; display:flex">
        <ng-container [cdkPortalOutlet]="uiService.headerMenu()"></ng-container>
      </div>

      @if (user(); as user) {
        <div style="display: flex; align-items: center">
          <button data-test-id="user-settings" mat-button [routerLink]="['/user']">
            @if (user.isAnonymous) {
              <div style="position: relative;display: flex;align-items: center;">
                <mat-icon style="position: relative;transform: rotate(2.5rad)">link</mat-icon>
                <mat-icon style="position: absolute;color: red;transform: scale(1.2,1.2);">not_interested</mat-icon>
                <span data-test-id="user-name" style="margin-left: 5px">{{ user?.uid?.substring(0, 10) }}</span>
              </div>
            } @else {
              <span data-test-id="user-name">{{ user?.displayName || user?.email }}</span>
            }
          </button>
        </div>
      }
      <mat-icon>{{ (appStore.online()) ? 'cloud_queue' : 'cloud_off' }}</mat-icon>
    </mat-toolbar>
  `,
  styles: ``
})
export class HeaderComponent {
  user = input.required<AuthUser>();
  appStore = inject(AppStore)
  uiService = inject(UiService)
}
