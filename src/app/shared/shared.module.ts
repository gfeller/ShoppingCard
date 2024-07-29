import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {OnlyAnonymousDirective, OnlyUserDirective} from './security/security.guard';
import {ConfirmButtonComponent} from './components/confirm-button.component';
import {PortalModule} from '@angular/cdk/portal';
import {MomentModule} from "ngx-moment";
import {MaterialModule} from "./material.module";


const DIRECTIVES = [OnlyAnonymousDirective, OnlyUserDirective];
const COMPONENTS = [ConfirmButtonComponent];


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PortalModule,
    MomentModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PortalModule,
    MomentModule,
    MaterialModule,
    ...DIRECTIVES,
    ...COMPONENTS
  ],
  declarations: [ ...DIRECTIVES, ...COMPONENTS]
})
export class SharedModule {
}
