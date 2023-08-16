import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router} from '@angular/router';
import {ListState} from '../../state/lists/reducer';
import {ListActions} from '../../state';


@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
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
