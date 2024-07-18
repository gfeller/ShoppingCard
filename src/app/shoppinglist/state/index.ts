import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';
import {ListState, reducer as listReducer} from './lists/reducer';


import * as ListActions from './lists/actions';


export {ListActions};

export interface ShoppingState {
  lists: ListState;
}

export const reducers: ActionReducerMap<ShoppingState> = {
  lists: listReducer
};

export const getShoppingFeature = createFeatureSelector<ShoppingState>('shopping');


