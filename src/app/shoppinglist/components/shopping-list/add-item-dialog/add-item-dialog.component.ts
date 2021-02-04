import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

interface AddItemDialogComponentData {
  isNew: boolean;
  description: string
}

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.scss']
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
