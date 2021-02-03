import {createSelector} from '@ngrx/store';
import {getShoppingFeature} from '../index';
import {ListState} from './reducer';

export const getListState = createSelector(getShoppingFeature, (state) => state.lists);

export const getLists = createSelector(
  getListState,
  (state: ListState) => {
    return Object.values(state.entities).filter(x => x.item);
  }
);

export const getSelectedListId = createSelector(
  getListState,
  (state: ListState) => {
    return state.selectedListId; //|| Object.values(state.entities)[0].id;
  }
);

export const getSelectedList = createSelector(
  getListState,
  getSelectedListId,
  (state: ListState, id: string) => {
    return state.entities[id];
  }
);
