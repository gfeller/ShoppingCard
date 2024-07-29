import {NgModule} from '@angular/core';
import {ShoppingListComponent, ShoppingListEntryComponent} from './components/shopping-list.component';
import {ListService} from './services/list.service';
import {SharedModule} from '../shared/shared.module';
import {AddItemDialogComponent} from './components/add-item-dialog.component';
import {ListComponent} from './components/list.component';

import {ShareComponent} from './components/share.component';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [ShoppingListComponent, AddItemDialogComponent, ListComponent, ShareComponent, ShoppingListEntryComponent],
  exports: [ShareComponent, ShoppingListComponent],
})
export class ShoppinglistModule {
  constructor(private listService: ListService) { // Eager
  }
}
