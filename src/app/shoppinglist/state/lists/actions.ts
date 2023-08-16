import {List} from '../../model/list';
import {Item} from '../../model/item';
import {createAction, props} from '@ngrx/store';

const key = 'SHOPPING';

export const add = createAction(`[${key}] Add`,
  props<{description: string}>());

export const update = createAction(`[${key}] Update`,
  props<{item: List}>());

export const readList = createAction(`[${key}] Read List`,
  props<{lists: List[]}>());

export const selectList = createAction(`[${key}] Select List`,
  props<{id: string}>());

export const loadList = createAction(`[${key}] Load List`,
  props<{id: string}>());

export const loadListSuccess = createAction(`[${key}] Load List Success`,
  props<{items: Item[]; id: string}>());

export const addShareList = createAction(`[${key}] Add Share List`,
  props<{id: string}>());

export const removeShareList = createAction(`[${key}] Remove Share List`,
  props<{id: string}>());
