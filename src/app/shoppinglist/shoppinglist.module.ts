import {NgModule} from '@angular/core';
import {ShoppingListComponent, ShoppingListPageComponent} from './components/shopping-list.component';
import {ListService} from './services/list.service';
import {StoreModule} from '@ngrx/store';
import {SharedModule} from '../shared/shared.module';
import {AddItemDialogComponent} from './components/add-item-dialog.component';
import {EffectsModule} from '@ngrx/effects';
import {ListComponent, ListPageComponent} from './components/list.component';

import {ShareComponent} from './components/share.component';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [ListPageComponent, ShoppingListComponent, ShoppingListPageComponent,
    AddItemDialogComponent, ListComponent, ShareComponent],
  exports: [ShoppingListPageComponent, ListPageComponent, ShareComponent],
})
export class ShoppinglistModule {
  constructor(private listService: ListService) { // Eager
  }
}
