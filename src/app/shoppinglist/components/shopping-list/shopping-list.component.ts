import {AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';

import {Store} from '@ngrx/store';
import {getLists} from '../../state/lists';
import {List} from '../../model/list';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {AddItemDialogComponent} from '../add-item-dialog/add-item-dialog.component';
import {StoreDto} from '../../../core/model/dto';
import {NotificationData} from '../../../core/state/core/actions';
import {ListState} from '../../state/lists/reducer';
import {selectNotifications, State} from '../../../core/state';
import {ListActions} from '../../state';
import {TemplatePortal} from '@angular/cdk/portal';
import {UiService} from '../../../core/services/ui.service';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements AfterViewInit, OnDestroy {

  @Input()
  public lists: StoreDto<List>[];

  @Input()
  public notifications: NotificationData[];

  @ViewChild('templateForParent', {static: true}) templateForParent: TemplateRef<any>;


  constructor(private store: Store<ListState>, public dialog: MatDialog, private viewContainerRef: ViewContainerRef, private uiService: UiService) {
  }


  ngAfterViewInit(): void {
    const templatePortal = new TemplatePortal(this.templateForParent, this.viewContainerRef);
    setTimeout(() => {
      this.uiService.setSubMenu(templatePortal);
    });
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
    <app-shopping-list [lists]="(lists$ | async)!" [notifications]="(notifications$ | async)!"></app-shopping-list>
  `,
})
export class ShoppingListPageComponent implements OnInit {
  public lists$: Observable<StoreDto<List>[]>;
  public notifications$!: Observable<NotificationData[]>;

  constructor(private store: Store<State>) {
    this.lists$ = store.select(getLists);
    this.notifications$ = store.select(selectNotifications);
  }
  ngOnInit() {
  }

}

