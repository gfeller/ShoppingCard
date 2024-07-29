import {NgModule} from '@angular/core';
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
import {MatProgressBarModule} from "@angular/material/progress-bar";

const MATERIAL = [ MatProgressBarModule, MatButtonModule, MatBadgeModule, MatInputModule, MatFormFieldModule, MatCardModule, MatDialogModule, MatMenuModule,
  MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatTabsModule, MatListModule, MatSnackBarModule];



@NgModule({
  imports: [
    ...MATERIAL
  ],
  exports: [
    ...MATERIAL,
  ]
})
export class MaterialModule {
}
