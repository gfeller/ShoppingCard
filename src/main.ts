import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";



/*
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
*/
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
