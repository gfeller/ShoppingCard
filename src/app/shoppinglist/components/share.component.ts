import {Component, inject, input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ListStore} from "../state/list-store";


@Component({
  selector: 'app-share',
  template: `
    <mat-card>
      <mat-card-title>
        Shared List
      </mat-card-title>
      <mat-card-subtitle>
        Eine Liste wurde mit Ihnen geteilt. Sie können diese Einladung annehmen oder verwerfen
      </mat-card-subtitle>
      <mat-card-content>
        <button mat-button color="primary" (click)="addShare()">
          <mat-icon>done</mat-icon>
          <span style="display: flex;align-self: center;line-height: 24px">Liste Hinzufügen</span>
        </button>
        <button mat-button color="primary" [routerLink]="['/']">
          <mat-icon>highlight_off</mat-icon>
          <span style="display: flex;align-self: center;line-height: 24px">Einladung verwerfen</span>
        </button>
      </mat-card-content>
    </mat-card>
  `
})
export class ShareComponent  {
  public id = input.required<string>();

  private store = inject(ListStore);
  private router = inject(Router);

  async addShare() {
    await this.store.addSharedList(this.id());
    await this.router.navigateByUrl('/list/' + this.id());
  }
}
