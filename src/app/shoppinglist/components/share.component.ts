import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router} from '@angular/router';
import {ListState} from '../state/lists/reducer';
import {ListActions} from '../state';


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
export class ShareComponent implements OnInit {
  public shareId: string;

  constructor(private store: Store<ListState>, private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.params.subscribe(params => {
      this.shareId = params['id'];
    });
  }

  addShare() {
    this.store.dispatch(ListActions.addShareList({id: this.shareId}));
    this.router.navigateByUrl('/list/' + this.shareId);
  }

  ngOnInit() {
  }

}
