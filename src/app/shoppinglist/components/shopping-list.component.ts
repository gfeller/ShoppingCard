import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {Store} from '@ngrx/store';
import {getLists} from '../state/lists';
import {List} from '../model/list';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {AddItemDialogComponent} from './add-item-dialog.component';
import {NotificationData} from '../../core/state/core/actions';
import {ListState} from '../state/lists/reducer';
import {selectNotifications, State} from '../../core/state';
import {ListActions} from '../state';
import {TemplatePortal} from '@angular/cdk/portal';
import {UiService} from '../../core/services/ui.service';
import {ListStore} from "../state/lists/store";


@Component({
  selector: 'app-shopping-list',
  template: `
    <router-outlet #myOutlet="outlet"></router-outlet>
    <div [hidden]="myOutlet.isActivated" style="padding-top: min(50%, 160px); text-align: center">Keine Liste ausgewählt. Erstellen Sie doch eine neue!</div>
    <ng-template #templateForParent>
      <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
      <nav mat-tab-nav-bar [tabPanel]="tabPanel">
        @for (list of lists; track list.id) {
          <a mat-tab-link
             [routerLink]="['/list/'+list.id]"
             routerLinkActive
             #rla="routerLinkActive"
             [active]="rla.isActive">

            <span [matBadgeHidden]="!getNotificationForList(list.id).length"
                  [matBadge]="getNotificationForList(list.id).length" style="overflow: visible"
                  matBadgeOverlap="false">{{ list.description }}</span>
          </a>
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
export class ShoppingListComponent implements AfterViewInit, OnDestroy {

  @Input()
  public lists: List[];

  @Input()
  public notifications: NotificationData[];

  @ViewChild('templateForParent', {static: true}) templateForParent: TemplateRef<any>;


  constructor(private store: Store<ListState>, public dialog: MatDialog, private viewContainerRef: ViewContainerRef, private uiService: UiService) {
  }


  ngAfterViewInit(): void {
    const templatePortal = new TemplatePortal(this.templateForParent, this.viewContainerRef);
    setTimeout(() => {
      this.uiService.setSubMenu(templatePortal);
    }, 1);
  }

  ngOnDestroy(): void {
    this.uiService.setSubMenu(null);
  }

  getNotificationForList(id: string) {
    return this.notifications.filter(x => x.data.containerId === id);
  }

  showDialog(event: Event) {
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      data: {description: '', isNew: true},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(ListActions.add(result.data));
      }
    });
    event.preventDefault();
    event.stopPropagation();
  }


}


@Component({
  selector: 'app-shopping-list-page',
  template: `
    <app-shopping-list [lists]="lists$()" [notifications]="notifications$ | async | notNull"></app-shopping-list>
  `,
})
export class ShoppingListPageComponent implements OnInit {
  public listStore = inject(ListStore)
  public lists$ = this.listStore.entities
  public notifications$!: Observable<NotificationData[]>;

  constructor(private store: Store<State>) {
    this.notifications$ = store.select(selectNotifications);
  }
  ngOnInit() {
  }

}

