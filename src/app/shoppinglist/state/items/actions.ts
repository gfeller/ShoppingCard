import {Item, ItemAddViewModel} from '../../model/item';
import {createAction, props} from '@ngrx/store';

const key = 'SHOP';

export const add = createAction(`[${key}] Add`,
  props<{item: ItemAddViewModel}>());

export const update = createAction(`[${key}] Update`,
  props<{item: Item}>());

export const remove = createAction(`[${key}] Remove`,
  props<{id: string}>());

export const removeSuccess = createAction(`[${key}] Remove Success`,
  props<{ids: string[]}>());
