import {createSelector} from '@ngrx/store';
import {getShoppingFeature} from '../index';
import {listAdapter, ListState} from './reducer';
import {List} from "../../model/list";
import {StoreDto} from "../../../core/model/dto";


const {selectAll} = listAdapter.getSelectors();
export const getListState = createSelector(getShoppingFeature, (state) => state.lists);

export const getLists = createSelector(
  getListState,
  (state) => {
    return Object.values(state.entities).filter(x => x!.item) as StoreDto<List>[];
  }
);

export const getSelectedListId = createSelector(
  getListState,
  (state: ListState) => {
    return state.selectedListId!;
  }
);

export const getSelectedList = createSelector(
  getListState,
  getSelectedListId,
  (state: ListState, id: string) => {
    return state.entities[id]!;
  }
);
