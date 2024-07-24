import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {List} from '../model/list';
import {Item, ItemAddViewModel} from '../model/item';
import {Timestamp} from 'firebase/firestore';
import {ShareService} from '../../core/services/share.service';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../core/services/ui.service';
import {TemplatePortal} from '@angular/cdk/portal';
import {AddItemDialogComponent} from './add-item-dialog.component';
import {ItemsStore} from "../state/items-store";
import {ListStore} from "../state/list-store";


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
      <i class="material-icons" style="cursor: pointer; margin-left: auto" (click)="showDialog($event, list)">edit</i>
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
    return Object.keys(this.list.owner).length;
  }


  @Input()
  public list: List;


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

  private itemsStore = inject(ItemsStore)
  private listStore = inject(ListStore)

  @ViewChild('templateForParent', {static: true}) templateForParent: TemplateRef<any>;

  constructor(private shareService: ShareService, private viewContainerRef: ViewContainerRef, private uiService: UiService, public dialog: MatDialog) {
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
    this.itemsStore.add(item ? item : {description: this.addNewItemText, listId: this.list.id})
    this.addNewItemText = '';
  }

  public checkItem(item: Item) {
    if (item.boughtAt == null) {
      this.itemsStore.update( {...item, boughtAt: Timestamp.now()})
    } else {
      this.addItem({description: item.description, listId: item.listId});
    }
  }

  public removeItem(event: Event, item: Item) {
    this.itemsStore.remove( item.id)
    event.stopPropagation();
  }


  showDialog(event: Event, list: List) {
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      data: {description: list.description, isNew: false},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delete) {
          this.listStore.removeSharedList( list.id!);
        } else if (result.data) {
          this.listStore.update({...list, description: result.data.description});
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
    <app-list [list]="list$() | notNull" [items]="items$()"></app-list>
  `,
})
export class ListPageComponent {
  public itemsStore = inject(ItemsStore)
  public listStore = inject(ListStore)

  public items$ = this.itemsStore.selectedItems;
  public list$ = this.listStore.selectedList;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];

      this.listStore.setSelectedListId(id)
    });
  }
}

