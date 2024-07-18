import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {AppEffects} from "./core/state/core/app.effects";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core/core.module";
import {DashboardModule} from "./dashboard/dashboard.module";
import {ShoppinglistModule} from "./shoppinglist/shoppinglist.module";
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    BrowserModule,
    DashboardModule,
    ShoppinglistModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([AppEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() , connectInZone: true}),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
