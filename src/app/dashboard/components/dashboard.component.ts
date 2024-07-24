import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <app-shopping-list></app-shopping-list>
  `,
})
export class DashboardComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {

  }
}
