import {AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {List} from '../model/list';
import {Item, ItemAddViewModel} from '../model/item';
import {getSelectedItems} from '../state/items';
import {getSelectedList} from '../state/lists';
import {Timestamp} from 'firebase/firestore';
import {NotificationData} from '../../core/state/core/actions';
import {StoreDto} from '../../core/model/dto';
import {ListState} from '../state/lists/reducer';
import {selectNotificationForList, State} from '../../core/state';
import {ItemsActions, ListActions} from '../state';
import {ShareService} from '../../core/services/share.service';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../core/services/ui.service';
import {TemplatePortal} from '@angular/cdk/portal';
import {AddItemDialogComponent} from './add-item-dialog.component';


@Component({
  selector: 'app-list',
  template: `
    <div class="layout">
      <mat-list class="content">
        @for(item of items; track item.id){
          <mat-list-item  (click)="checkItem(item)" [ngClass]="{'finished': !!item.boughtAt}"
                         style="cursor: pointer">
            <div style="display: flex">
              <mat-icon *ngIf="!item.boughtAt">done</mat-icon>
              <mat-icon *ngIf="!!item.boughtAt">add_shopping_cart</mat-icon>
              <span class="full-width"> {{item.description}}</span>
              <span *ngIf="!!item.boughtAt" style="white-space: nowrap">{{item.boughtAt.toDate() |   amTimeAgo}}</span>
              <mat-icon *ngIf="!!item.boughtAt">done</mat-icon>
              <mat-icon *ngIf="!item.boughtAt" (click)="removeItem($event, item)" color="warn">delete</mat-icon>
            </div>
          </mat-list-item>
        } @empty {
          <div class="blank-slate">
            Liste ist noch leer!
          </div>
        }
      </mat-list>

      <div>
        <form (submit)="addItem()" class="item-add-form">
          <mat-form-field>
            <input matInput placeholder="Wir brauchen" #newItem [(ngModel)]="addNewItemText" name="item-text">
          </mat-form-field>
          <button mat-icon-button color="primary" type="submit">
            <mat-icon>add</mat-icon>
          </button>
        </form>
      </div>
    </div>

    <ng-template #templateForParent>
      <i class="material-icons" style="cursor: pointer" (click)="shareList()">share</i>
      <i class="material-icons" style="cursor: pointer; margin-left: auto" (click)="showDialog($event, list.item!)">edit</i>
    </ng-template>
  `,
  styles: `
    .mat-list-item {
      display: flex;
    }

    .mat-list-item mat-icon {
      margin-left: auto;
      cursor: pointer;
    }

    .mat-list-item:nth-of-type(even) {
      background: lightgray;
    }

    .finished {
      opacity: 0.5;
    }

    .layout {
      position: relative;
      display: flex;
      flex-direction: column;
      max-height: 100%;
      height: 100%;

      .content {
        overflow: auto;
        flex: 1 1 100%;
      }
    }

    .item-add-form {
      display: flex;
      align-items: center;
      margin-left: 10px;

      :first-child {
        flex: 1;
      }
    }


    .blank-slate {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

  `
})
export class ListComponent implements AfterViewInit, OnDestroy {
  private _items: Item[];

  public addNewItemText: string;

  get ownerCount() {
    return Object.keys(this.list.item!.owner).length;
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
        return 0;
      }
    });
  }

  @ViewChild('templateForParent', {static: true}) templateForParent: TemplateRef<any>;

  constructor(private store: Store<ListState>, private shareService: ShareService, private viewContainerRef: ViewContainerRef, private uiService: UiService, public dialog: MatDialog,) {
  }

  ngAfterViewInit(): void {
    const templatePortal = new TemplatePortal(this.templateForParent, this.viewContainerRef);
    setTimeout(() => {
      this.uiService.setHeaderMenu(templatePortal);
    });
  }


  ngOnDestroy(): void {
    this.uiService.setHeaderMenu(null);
  }

  public shareList() {
    this.shareService.share('Einladung', `https://ikaufzetteli.firebaseapp.com/list/share/${this.list.id}`);
  }

  public addItem(item?: ItemAddViewModel) {
    this.store.dispatch(ItemsActions.add({
      item: item ?
        item : {description: this.addNewItemText, listId: this.list.id}
    }));
    this.addNewItemText = '';
  }

  public checkItem(item: Item) {
    if (item.boughtAt == null) {
      this.store.dispatch(ItemsActions.update({item: {...item, boughtAt: Timestamp.now()}}));
    } else {
      this.addItem({description: item.description, listId: item.listId});
    }
  }

  public removeItem(event: Event, item: Item) {
    this.store.dispatch(ItemsActions.remove({id: item.id!}));
    event.stopPropagation();
  }


  showDialog(event: Event, list: List) {

    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      data: {description: list.description, isNew: false},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delete) {
          this.store.dispatch(ListActions.removeShareList({id: list.id!}));
        } else if (result.data) {
          this.store.dispatch(ListActions.update({item: {...list, description: result.data.description}}));
        }
      }
    });
    event.preventDefault();
    event.stopPropagation();
  }
}

@Component({
  selector: 'app-list-page',
  template: `
    <app-list [list]="list$ | async | notNull" [items]="items$ | async | notNull" [notifications]="notifications$ | async | notNull"></app-list>
  `,
})
export class ListPageComponent implements OnInit {
  public items$: Observable<Item[]> = new Observable<Item[]>();
  public list$: Observable<StoreDto<List>> = new Observable<StoreDto<List>>();
  public notifications$: Observable<NotificationData[]> = new Observable<NotificationData[]>();

  constructor(private coreStore: Store<State>, private store: Store<ListState>, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      store.dispatch(ListActions.selectList({id}));
      this.list$ = this.store.select(getSelectedList);
      this.items$ = this.store.select(getSelectedItems);
      this.notifications$ = this.coreStore.select(selectNotificationForList(id));
    });
  }

  ngOnInit() {
  }
}

