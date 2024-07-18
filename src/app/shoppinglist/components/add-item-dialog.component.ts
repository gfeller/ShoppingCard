import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

interface AddItemDialogComponentData {
  isNew: boolean;
  description: string
}

@Component({
  selector: 'app-add-item-dialog',
  template: `
    <h1 mat-dialog-title>{{data.isNew ? 'Neue Liste erfassen' : 'Liste anpassen'}}</h1>
    <form (submit)="onYesClick()">
      <div mat-dialog-content>
        <mat-form-field>
          <input matInput name="description" [(ngModel)]="data.description" placeholder="Name der Liste" cdkFocusInitial>
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-raised-button (click)="onNoClick()" type="reset" color="basic">Doch nicht</button>
        <button mat-raised-button (click)="onYesClick()" color="primary">{{data.isNew ? 'Erstellen' : 'Änderungen übernehmen'}}</button>
        <app-confirm-button *ngIf="!data.isNew" (delete)="onDeleteClick()"></app-confirm-button>
      </div>
    </form>
  `
})
export class AddItemDialogComponent {

  constructor(public dialogRef: MatDialogRef<AddItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AddItemDialogComponentData) {

  }

  onNoClick(): void {
    this.dialogRef.close({});
  }

  onDeleteClick(): void {
    this.dialogRef.close({delete: true});
  }

  onYesClick(): void {
    this.dialogRef.close({data: this.data});
  }
}
