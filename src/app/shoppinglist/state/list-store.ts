import {patchState, signalStore, withState,} from "@ngrx/signals";
import {withDevtools} from "@angular-architects/ngrx-toolkit";
import {setAllEntities, withEntities} from "@ngrx/signals/entities";

import {computed, inject, Injectable} from "@angular/core";
import {List} from "../model/list";
import {ListService} from "../services/list.service";

interface ListStoreState{
  selectedListId : string | undefined
}
@Injectable({providedIn: "root"})
export class ListStore extends signalStore(  { providedIn: 'root' },
  withDevtools('list'),
  withState<ListStoreState>({selectedListId: undefined}),
  withEntities<List>()){

  listService = inject(ListService)

  constructor() {
    super();
    this.listService.onChanged.subscribe((args) => this.#setLists(args))
  }

  selectedList = computed(() => {
    return this.entities().find((entry) => entry.id === this.selectedListId());
  })

  setSelectedListId(id : string){
    patchState(this, {selectedListId: id})
  }

  #setLists(lists: List[]) {
    patchState(this, setAllEntities(lists));
    if(this.selectedListId() === undefined) {
      patchState(this, {selectedListId: lists[0]?.id});
    }
  }

  add(desc:string) {
    this.listService.addList(desc);
  }

  async addSharedList(id: string){
    await this.listService.addShareList(id);
    patchState(this, {selectedListId: id});
  }

  async removeSharedList(id: string) {
    await this.listService.removeShareList(id);
    if (this.selectedListId() === id) {
      patchState(this, {selectedListId: undefined});
    }
  }

  remove(id: string){
    this.listService.remove(id);
  }

  update(item: List) {
    this.listService.update(item);
  }
}
