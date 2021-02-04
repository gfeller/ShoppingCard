import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {List} from '../../model/list';
import {Item} from '../../model/item';
import {getSelectedItems} from '../../state/items';
import {getSelectedList} from '../../state/lists';
import firebase from 'firebase/app';
import {NotificationData} from '../../../core/state/core/actions';
import {StoreDto} from '../../../core/model/dto';
import {ListState} from '../../state/lists/reducer';
import {selectNotificationForList, State} from '../../../core/state';
import {ItemsActions, ListActions} from '../../state';
import {ShareService} from '../../../core/services/share.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  private _items: Item[];

  public addNewItemText: string;

  get ownerCount() {
    return Object.keys(this.list.item.owner).length;
  }

  @Input()
  public notifications: NotificationData[];

  @Input()
  public list: StoreDto<List>;


  get items(): Item[] {
    return this._items;
  }

  @Input()
  set items(value: Item[]) {
    this._items = value.sort((a, b) => {
      if (a.boughtAt) {
        if (b.boughtAt) {
          return +b.boughtAt.toDate() - +a.boughtAt.toDate();
        }
        return 1;
      } else if (b.boughtAt) {
        return -1;
      } else {
        return +b.createdAt.toDate() - +a.createdAt.toDate();
      }
    });
  }


  constructor(private store: Store<ListState>, private shareService: ShareService) {
  }

  public shareList() {
    this.shareService.share('Einladung', `https://ikaufzetteli.firebaseapp.com/list/share/${this.list.id}`);
  }

  public addItem(item?: Item) {
    this.store.dispatch(ItemsActions.add({
      item: item ?
        item : {description: this.addNewItemText, listId: this.list.id}
    }));
    this.addNewItemText = '';
  }

  public checkItem(item: Item) {
    if (item.boughtAt == null) {
      this.store.dispatch(ItemsActions.update({item: {...item, boughtAt: firebase.firestore.Timestamp.now()}}));
    } else {
      this.addItem({description: item.description, listId: item.listId});
    }
  }

  public removeItem(event: Event, item: Item) {
    this.store.dispatch(ItemsActions.remove({id: item.id}));
    event.stopPropagation();
  }
}

@Component({
  selector: 'app-list-page',
  template: `
    <app-list [list]="list$ | async" [items]="items$ | async" [notifications]="notifications$ | async"></app-list>
  `,
})
export class ListPageComponent implements OnInit {
  public items$: Observable<Item[]>;
  public list$: Observable<StoreDto<List>>;
  public notifications$: Observable<NotificationData[]>;

  constructor(private coreStore: Store<State>, private store: Store<ListState>, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      store.dispatch(ListActions.selectList({id}));
      this.list$ = this.store.select(getSelectedList);
      this.items$ = this.store.select(getSelectedItems);
      this.notifications$ = this.coreStore.select(selectNotificationForList(id));
    });
  }

  ngOnInit() {
  }
}

