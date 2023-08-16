import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SafePipe} from './util/safe.pipe';
import {OnlyAnonymousDirective, OnlyUserDirective} from './security/security.guard';
import {ConfirmButtonComponent} from './components/confirm-button/confirm-button.component';
import {PortalModule} from '@angular/cdk/portal';
import {MomentModule} from "ngx-moment";

const MATERIAL = [MatButtonModule, MatBadgeModule, MatInputModule, MatFormFieldModule, MatCardModule, MatDialogModule, MatMenuModule,
  MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatTabsModule, MatListModule, MatSnackBarModule];

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
    ...MATERIAL
  ],
  exports: [

    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PortalModule,
    MomentModule,
    SafePipe,
    ...MATERIAL,
    ...DIRECTIVES,
    ...COMPONENTS
  ],
  declarations: [SafePipe, ...DIRECTIVES, ...COMPONENTS]
})
export class SharedModule {
}
