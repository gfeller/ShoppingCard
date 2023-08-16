import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <app-shopping-list-page></app-shopping-list-page>
  `,
})
export class DashboardComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {

  }
}
