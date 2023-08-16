import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';
import {ListState, reducer as listReducer} from './lists/reducer';
import {ItemsState, reducer} from './items/reducer';

import * as ListActions from './lists/actions';
import * as ItemsActions from './items/actions';

export {ListActions, ItemsActions};

export interface ShoppingState {
  lists: ListState;
  items: ItemsState;
}

export const reducers: ActionReducerMap<ShoppingState> = {
  lists: listReducer,
  items: reducer
};

export const getShoppingFeature = createFeatureSelector<ShoppingState>('shopping');


