import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {DashboardComponent} from './components/dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './components/user.component';
import {ListComponent} from '../shoppinglist/components/list.component';
import {ShareComponent} from '../shoppinglist/components/share.component';
import {ShoppinglistModule} from '../shoppinglist/shoppinglist.module';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      {path: 'list/:id', component: ListComponent},
      {path: 'list/share/:id', component: ShareComponent}
    ]
  },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      {path: 'list/:id', component: ListComponent},
      {path: 'list/share/:id', component: ShareComponent}
    ]
  },
  {path: 'user', component: UserComponent},
];

@NgModule({
  imports: [
    SharedModule,
    ShoppinglistModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DashboardComponent, UserComponent]
})
export class DashboardModule {
}
