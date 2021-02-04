import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {ServiceWorkerModule} from '@angular/service-worker';
import {AppEffects} from './core/state/core/app.effects';
import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core/core.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {Store} from '@ngrx/store';
import {State} from './core/state';
import {DeviceDetectorService} from 'ngx-device-detector';
import {uiInformationChanged} from './core/state/core/actions';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    DashboardModule,
    EffectsModule.forRoot([AppEffects]),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private coreStore: Store<State>, private deviceService: DeviceDetectorService) {
    coreStore.dispatch(uiInformationChanged({info: {isMobile: deviceService.isMobile()}}));
  }
}
