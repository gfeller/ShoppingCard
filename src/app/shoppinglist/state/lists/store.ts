import {patchState, signalStore, withState,} from "@ngrx/signals";
import {withDevtools} from "@angular-architects/ngrx-toolkit";
import {addEntity, setAllEntities, withEntities} from "@ngrx/signals/entities";

import {computed, inject, Injectable} from "@angular/core";
import {List} from "../../model/list";
import {ListService} from "../../services/list.service";

interface ListStoreState{
  selectedListId : string | undefined
}
@Injectable({providedIn: "root"})
export class ListStore extends signalStore(  { providedIn: 'root' },
  withDevtools('list'),
  withState<ListStoreState>({selectedListId: undefined}),
  withEntities<List>()){


  listService = inject(ListService)

  selectedList = computed(() => {
    return this.entities().find((entry) => entry.id === this.selectedListId());
  })

  setSelectedListId(id : string){
    patchState(this, {selectedListId: id})
  }


  setLists(lists: List[]){
    patchState(this, setAllEntities(lists));
  }
}
