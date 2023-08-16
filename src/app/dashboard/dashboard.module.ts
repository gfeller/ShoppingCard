import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent, UserPageComponent} from './components/user/user.component';
import {ListPageComponent} from '../shoppinglist/components/list/list.component';
import {ShareComponent} from '../shoppinglist/components/share/share.component';
import {ShoppinglistModule} from '../shoppinglist/shoppinglist.module';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      {path: 'list/:id', component: ListPageComponent},
      {path: 'list/share/:id', component: ShareComponent}
    ]
  },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      {path: 'list/:id', component: ListPageComponent},
      {path: 'list/share/:id', component: ShareComponent}
    ]
  },
  {path: 'user', component: UserPageComponent},
];

@NgModule({
  imports: [
    SharedModule,
    ShoppinglistModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DashboardComponent, UserComponent, UserPageComponent]
})
export class DashboardModule {
}
