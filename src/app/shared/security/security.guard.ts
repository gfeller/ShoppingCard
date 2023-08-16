import {ChangeDetectorRef, Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {selectUser, State} from '../../core/state';
import {Subscription} from 'rxjs';
import {AuthUser} from '../../core/state/core/model';


@Directive()
abstract class OnlyBaseDirective implements OnDestroy, OnInit {
  private subscription!: Subscription;
  private state = false;

  constructor(private store: Store<State>, private _viewContainer: ViewContainerRef, private _template: TemplateRef<object>, private ref: ChangeDetectorRef) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.store.select(selectUser).subscribe(user => {
      const newState = user ? this.show(user) : false;

      if (newState !== this.state) {
        this.state = newState;

        if (this.state) {
          this._viewContainer.createEmbeddedView(this._template);
        } else {
          this._viewContainer.clear();
        }
        this.ref.markForCheck();
      }
    });
  }

  protected abstract show(user: AuthUser): boolean;
}

@Directive({
  selector: '[appOnlyAnonymous]',
})
export class OnlyAnonymousDirective extends OnlyBaseDirective {
  protected show(user: AuthUser): boolean {
    return user.isAnonymous;
  }
}

@Directive({
  selector: '[appOnlyUser]',
})
export class OnlyUserDirective extends OnlyBaseDirective {
  protected show(user: AuthUser): boolean {
    return !user.isAnonymous;
  };
}

