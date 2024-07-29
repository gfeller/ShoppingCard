import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListComponent} from "./shoppinglist/components/list.component";
import {ShareComponent} from "./shoppinglist/components/share.component";
import {UserComponent} from "./core/components/user.component";
import {ShoppingListComponent} from "./shoppinglist/components/shopping-list.component";

const routes: Routes = [
  {
    path: '', component: ShoppingListComponent, children: [
      {path: 'list/:id', component: ListComponent},
      {path: 'list/share/:id', component: ShareComponent}
    ]
  },
  {path: 'user', component: UserComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {bindToComponentInputs: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
