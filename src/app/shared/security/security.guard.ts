import {ChangeDetectorRef, Directive, effect, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthUser} from '../../core/model/auth';
import {AppStore} from "../../core/state/app-store";


@Directive()
abstract class OnlyBaseDirective {
  private state = false;

  constructor(private appStore: AppStore, private _viewContainer: ViewContainerRef, private _template: TemplateRef<object>, private ref: ChangeDetectorRef) {
    effect(() => {
      const user = this.appStore.user()
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
    })
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

