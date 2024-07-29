import {ChangeDetectorRef, Component, input, output, signal} from '@angular/core';

@Component({
  selector: 'app-confirm-button',
  template: `
    @if (small()) {
      <button mat-icon-button (click)="onDelete()" type="button" color="warn">
        <mat-icon>{{ confirmed() ? 'delete_forever' : 'delete' }}</mat-icon>
      </button>
    } @else {
      <button mat-raised-button (click)="onDelete()" type="button"
              color="warn">{{ confirmed() ? "Löschen bestätigen" : "Löschen" }}
      </button>
    }`
})
export class ConfirmButtonComponent  {

  delete = output<void>();
  small = input<boolean>(false);

  confirmed = signal(false);

  constructor(private ref: ChangeDetectorRef) {
  }

  onDelete() {
    if (this.confirmed()) {
      this.delete.emit();
    } else {
      this.confirmed.set(true);

      setTimeout(() => {
        this.confirmed.set(false);
      }, 1500);
    }
  }
}

