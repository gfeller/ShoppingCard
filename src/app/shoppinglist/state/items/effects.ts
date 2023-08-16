import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap} from 'rxjs/operators';

import {from, Observable} from 'rxjs';
import {ListService} from '../../services/list.service';
import {ItemService} from '../../services/item.service';
import * as ListActions from '../lists/actions';
import {add, remove, update} from './actions';

@Injectable()
export class ShoppingItemsEffects {
  private isOnline$!: Observable<boolean>;

  constructor(private actions$: Actions, private listService: ListService, private itemService: ItemService) {
  }

  get$ = createEffect(() => this.actions$.pipe(
    ofType(ListActions.selectList, ListActions.loadList),
    mergeMap(data => {
      return this.itemService.getFromList(data.id);
    })
  ), {dispatch: false});

  add$ = createEffect(() => this.actions$.pipe(
    ofType(add),
    mergeMap(data => {
      return from(this.itemService.add(data.item));
    })
  ), {dispatch: false});

  remove$ = createEffect(() => this.actions$.pipe(
    ofType(remove),
    mergeMap(data => {
      return this.itemService.remove(data.id);
    })
  ), {dispatch: false});

  update$ = createEffect(() => this.actions$.pipe(
    ofType(update),
    mergeMap(data => {
      return this.itemService.update(data.item);
    })
  ), {dispatch: false});
}
