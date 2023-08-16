import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-button',
  templateUrl: './confirm-button.component.html',
  styleUrls: ['./confirm-button.component.scss']
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

