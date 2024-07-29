import {Component, computed, effect, inject, input, TemplateRef, viewChild} from '@angular/core';

import {List} from '../model/list';
import {MatDialog} from '@angular/material/dialog';
import {AddItemDialogComponent} from './add-item-dialog.component';
import {ListStore} from "../state/list-store";
import {AppStore} from "../../core/state/app-store";
import {useMenu} from "../../shared/hooks/use-menu.hook";
import {Router} from "@angular/router";


@Component({
  selector: 'app-shopping-list-entry',
  template: `
    <a mat-tab-link
       [routerLink]="['/list/'+list().id]"
       routerLinkActive
       #rla="routerLinkActive"
       [active]="rla.isActive">

            <span [matBadgeHidden]="!notifications().length"
                  [matBadge]="notifications().length" style="overflow: visible"
                  matBadgeOverlap="false">{{ list().description }}</span>
    </a>`
})
export class ShoppingListEntryComponent{
  public appStore = inject(AppStore)
  public list = input.required<List>()

  notifications = computed(() => {
    return this.appStore.notifications().filter(x => x.data.containerId === this.list().id);
  });
}



@Component({
  selector: 'app-shopping-list',
  template: `
    <router-outlet #myOutlet="outlet"></router-outlet>
    <div [hidden]="myOutlet.isActivated" style="padding-top: min(50%, 160px); text-align: center">Keine Liste ausgewählt. Erstellen Sie doch eine neue!</div>
    <ng-template #templateForParent>
      <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
      <nav mat-tab-nav-bar [tabPanel]="tabPanel">
        @for (list of listStore.entities(); track list.id) {
          <app-shopping-list-entry [list]="list" style="flex: 1"/>
        }
        <a mat-tab-link>
          <div (click)="showDialog($event)" style="top: 0;bottom: 0;position: absolute;right: 0;left:0">
          </div>
          <mat-icon><i class="material-icons">add_circle_outline</i></mat-icon>
        </a>
      </nav>
    </ng-template>
  `
})
export class ShoppingListComponent  {
  public listStore = inject(ListStore)
  public dialog = inject(MatDialog);
  public template = viewChild<TemplateRef<Element>>('templateForParent');

  constructor() {
    useMenu("sub", this.template);
  }

  showDialog(event: Event) {
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      data: {description: '', isNew: true},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listStore.add(result.data.description);
      }
    });
    event.preventDefault();
    event.stopPropagation();
   }
}
