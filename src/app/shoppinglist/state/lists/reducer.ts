import {createReducer, on} from '@ngrx/store';

import * as ListActions from './actions';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {List} from '../../model/list';

export interface ListState extends EntityState<List> {
  selectedListId: string | null;
}

export const listAdapter = createEntityAdapter<List>();


const initState : ListState = {
  ids: [],
  entities: {},
  selectedListId: null
}

export const reducer = createReducer(
  listAdapter.getInitialState(initState),
  on(ListActions.readList, (state, data) => {
    state = listAdapter.removeAll(state);
    return listAdapter.addMany(data.lists, state);
  }),
//  on(ListActions.loadList, (state, data) => (listAdapter.updateOne({id: data.id, changes: {isLoading: true}}, state))),
//  on(ListActions.loadListSuccess, (state, data) => (listAdapter.updateOne({id: data.id, changes: {isLoading: false}}, state))),
  on(ListActions.selectList, (state, data) => ({...state, selectedListId: data.id})),
  on(ListActions.removeShareList, (state, data) => {
    if (data.id === state.selectedListId) {
      return {...state, selectedListId: null};
    }
    return state;
  }),
);


