import {patchState, signalStore, withComputed, withHooks, withMethods, withState,} from '@ngrx/signals';
import {withDevtools} from "@angular-architects/ngrx-toolkit";
import {setAllEntities, withEntities} from "@ngrx/signals/entities";

import {computed, inject, Injectable} from "@angular/core";
import {List} from "../model/list";
import {ListService} from "../services/list.service";

interface ListStoreState {
  selectedListId : string | undefined
}

export const ListStore = signalStore({providedIn: 'root'},
  withDevtools('list'),
  withState<ListStoreState>({selectedListId: undefined}),
  withEntities<List>(),
  withComputed(state => ({
    selectedList : computed(() => {
      return state.entities().find((entry) => entry.id === state.selectedListId());
    }),
  })),
  withMethods(((state,  listService = inject(ListService)) => ({
      setSelectedListId(id : string){
        patchState(state, {selectedListId: id})
      },

      _setLists(lists: List[]) {
        patchState(state, setAllEntities(lists));
      },

      add(desc:string) {
        listService.addList(desc);
      },

      async addSharedList(id: string){
        await listService.addShareList(id);
        patchState(state, {selectedListId: id});
      },

      async removeSharedList(id: string) {
        await listService.removeShareList(id);
        if (state.selectedListId() === id) {
          patchState(state, {selectedListId: undefined});
        }
      },

      remove(id: string){
        listService.remove(id);
      },

      update(item: List) {
        listService.update(item);
      },

    })
  )),
  withHooks({
    onInit(store, listService = inject(ListService)) {
      listService.onChanged.subscribe((args) => store._setLists(args))
    }
  }),
);
