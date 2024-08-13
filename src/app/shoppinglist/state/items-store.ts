import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {withDevtools} from "@angular-architects/ngrx-toolkit";
import {addEntities, removeEntities, setAllEntities, withEntities} from '@ngrx/signals/entities';
import {Item, ItemAddViewModel} from "../model/item";
import {computed, effect, inject, Injectable} from "@angular/core";

import {ListStore} from "./list-store";
import {ItemService} from "../services/item.service";
import {List} from '../model/list';
import {ListService} from '../services/list.service';

export const ItemsStore = signalStore({providedIn: 'root'},
  withDevtools('list'),
  withEntities<Item>(),
  withComputed((state, listStore = inject(ListStore)) => ({
    selectedItems : computed(() => {
      const selectedListId = listStore.selectedListId();
      if (selectedListId != undefined) {
        return state.entities().filter(x => x.listId === selectedListId) as Item[];
      }
      return [];
    })
  })),
  withMethods(((state,  itemService = inject(ItemService)) => ({
      _loadList(items: Item[]){
        patchState(state, addEntities(items))
      },

      _remove(ids: string[]){
        patchState(state, removeEntities(ids))
      },

      get(id:string){
        itemService.getFromList(id);
      },

      add(item: ItemAddViewModel){
        itemService.add(item);
      },

      remove(id: string){
        itemService.remove(id);
      },

      update(item: Item){
        itemService.update(item);
      },
    })
  )),
  withHooks({
    onInit(store, itemService = inject(ItemService), listStore = inject(ListStore)) {
      itemService.onRemove.subscribe((args) => store._remove(args))
      itemService.onAdd.subscribe((args) => store._loadList(args))

      effect(() => {
        if(listStore.selectedListId()){
          store.get(listStore.selectedListId()!);
        }
      })
    }
  }),
);
