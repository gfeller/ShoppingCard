import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-button',
  template: `
    <button mat-raised-button *ngIf="!small" (click)="onDelete()" type="button"
            color="warn">{{confirmed ? "Löschen bestätigen" : "Löschen"}}</button>
    <button mat-icon-button *ngIf="small" (click)="onDelete()" type="button" color="warn">
      <mat-icon>{{confirmed ? 'delete_forever' : 'delete'}}</mat-icon>
    </button>
  `
})
export class ConfirmButtonComponent implements OnInit {

  @Output() delete = new EventEmitter<string>();
  @Input() small = false;

  confirmed = false;

  constructor(private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  onDelete() {
    if (this.confirmed) {
      this.delete.emit();
    } else {
      this.confirmed = true;

      setTimeout(() => {
        this.confirmed = false;
      }, 1500);
    }
  }
}

