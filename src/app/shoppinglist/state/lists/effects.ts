import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, withLatestFrom} from 'rxjs/operators';
import {ListService} from '../../services/list.service';
import * as ListActions from './actions';
import {Store} from '@ngrx/store';
import {State} from '../../../core/state';
import {getSelectedListId} from './index';
import {Router} from '@angular/router';
import {from, of} from 'rxjs';

@Injectable()
export class ShoppingListEffects {
  constructor(private actions$: Actions, private coreStore: Store<State>, private listService: ListService, private router: Router) {
  }

  add$ = createEffect(() => this.actions$.pipe(
    ofType(ListActions.add),
    mergeMap(data => {
      return this.listService.addList(data.description);
    })
  ), {dispatch: false});

  update$ = createEffect(() => this.actions$.pipe(
    ofType(ListActions.update),
    mergeMap(data => {
      return this.listService.update(data.item);
    })
  ), {dispatch: false});

  addSharedList$ = createEffect(() => this.actions$.pipe(
    ofType(ListActions.addShareList),
    mergeMap(data => {
      return this.listService.addShareList(data.id);
    })
  ), {dispatch: false});


  removeSharedList$ = createEffect(() => this.actions$.pipe(
    ofType(ListActions.removeShareList),
    mergeMap(data => {
      return this.listService.removeShareList(data.id);
    })
  ), {dispatch: false});


  selectDefaultFirstList = createEffect(() => this.actions$.pipe(
    ofType(ListActions.readList),
    withLatestFrom(this.coreStore.select(getSelectedListId)),
    mergeMap((data) => {
      if (data[0].lists.length > 0 && data[1] == null && this.router.url === '/') {
        return from(this.router.navigateByUrl(`/list/${data[0].lists[0].id}`));
      }
      return of();
    })
  ), {dispatch: false});
}
