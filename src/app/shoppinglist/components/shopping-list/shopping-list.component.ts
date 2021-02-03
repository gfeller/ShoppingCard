import {Component, Input, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {getLists, getSelectedList} from '../../state/lists';
import {List} from '../../model/list';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {AddItemDialogComponent} from './add-item-dialog/add-item-dialog.component';
import {StoreDto} from '../../../core/model/dto';
import {NotificationData} from '../../../core/state/core/actions';
import {ListState} from '../../state/lists/reducer';
import {selectNotifications, State} from '../../../core/state';
import {ListActions} from '../../state';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent {

  @Input()
  public lists: StoreDto<List>[];

  @Input()
  public notifications: NotificationData[];

  constructor(private store: Store<ListState>, public dialog: MatDialog) {

  }

  getNotificationForList(id) {
    return this.notifications.filter(x => x.data.containerId === id);
  }

  showDialog(event, list?: List) {
    const isNew: boolean = !list;

    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      width: '250px',
      data: {description: list ? list.description : '', isNew}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (isNew) {
          this.store.dispatch(ListActions.add(result));
        } else {
          list.description = result.description;
          this.store.dispatch(ListActions.update({item: list}));
        }

      }
    });
    event.preventDefault();
    event.stopPropagation();
  }
}


@Component({
  selector: 'app-shopping-list-page',
  template: `
    <app-shopping-list [lists]="lists$ | async" [notifications]="notifications$ | async"></app-shopping-list>
  `,
})
export class ShoppingListPageComponent implements OnInit {
  public lists$: Observable<StoreDto<List>[]>;
  public notifications$: Observable<NotificationData[]>;

  constructor(private store: Store<State>) {
    this.lists$ = store.select(getLists);
    this.notifications$ = store.select(selectNotifications);
  }

  ngOnInit() {
  }

}

