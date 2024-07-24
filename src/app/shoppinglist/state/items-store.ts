import {patchState, signalStore} from "@ngrx/signals";
import {withDevtools} from "@angular-architects/ngrx-toolkit";
import {addEntities, removeEntities, withEntities} from "@ngrx/signals/entities";
import {Item, ItemAddViewModel} from "../model/item";
import {computed, effect, inject, Injectable} from "@angular/core";

import {ListStore} from "./list-store";
import {ItemService} from "../services/item.service";


@Injectable({providedIn: "root"})
export class ItemsStore extends signalStore(  { providedIn: 'root' },
  withDevtools('items'),
  withEntities<Item>()) {

  listStore = inject(ListStore)
  itemService = inject(ItemService)


  constructor() {
    super();

    this.itemService.onRemove.subscribe((args) => this.#remove(args))
    this.itemService.onAdd.subscribe((args) => this.#loadList(args))

    effect(() => {
      if(this.listStore.selectedListId()){
        this.get(this.listStore.selectedListId()!);
      }
    })
  }
  selectedItems = computed(() => {
    const selectedListId = this.listStore.selectedListId();
    if (selectedListId != undefined) {
      return this.entities().filter(x => x.listId === selectedListId) as Item[];
    }
    return [];
  });


  #loadList(items: Item[]){
    patchState(this, addEntities(items))
  }

  #remove(ids: string[]){
    patchState(this, removeEntities(ids))
  }

  get(id:string){
    this.itemService.getFromList(id);
  }

  add(item: ItemAddViewModel){
    this.itemService.add(item);
  }

  remove(id: string){
    this.itemService.remove(id);
  }

  update(item: Item){
    this.itemService.update(item);
  }
}
