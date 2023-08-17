import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';


import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {selectIsOnline, State} from '..';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {MessagingService} from '../../services/messaging.service';
import {
  authChanged,
  authConnect,
  authConnectError,
  authLogin,
  authResetPwd,
  authResetPwdSuccess,
  authUserSettingsChanged,
  init,
  initSuccess,
  message,
  notificationGrantRequest,
  removeNotificationGrant,
  removeNotificationGrantSuccess
} from './actions';


@Injectable()
export class AppEffects {
  private isOnline$!: Observable<boolean>;

  constructor(private actions$: Actions, store: Store<State>, private authService: AuthService, private messageService: MessagingService) {
    this.isOnline$ = store.select(selectIsOnline);
  }

  load$ = createEffect(() => this.actions$.pipe(
    ofType(init),
    map(res => initSuccess())
  ));

  authConnect$ = createEffect(() => this.actions$.pipe(
    ofType(authConnect),
    switchMap((data) => {
      return this.authService.connectUser(data).pipe(
        map(res => authChanged(res)),
        catchError((error) => of(authConnectError(error)))
      );
    }),
  ));

  authLogin$ = createEffect(() => this.actions$.pipe(
    ofType(authLogin),
    switchMap((data) => {
      return this.authService.login(data).pipe(
        map(res => authChanged(res)),
        catchError((error) => of(authConnectError(error)))
      );
    }),
  ));

  authResetPwd$ = createEffect(() => this.actions$.pipe(
    ofType(authResetPwd),
    switchMap((data) => {
      return this.authService.resetPwdMail(data.email).pipe(
        mergeMap(res => [
          authResetPwdSuccess(),
          message({message: 'E-Mail wurde versendet'})
        ]),
        catchError((error) => of(authConnectError(error)))
      );
    }),
  ));

  authUserSettingsChange$ = createEffect(() => this.actions$.pipe(
    ofType(authUserSettingsChanged),
    switchMap((data) => {
      return this.authService.changeUser(data).pipe(
        mergeMap(res => [
          authChanged(res),
          message({message: 'Änderung übernommen'})
        ]),
        catchError((error) => of(authConnectError(error)))
      );
    }),
  ));


  requestNotificationGrant$ = createEffect(() => this.actions$.pipe(
    ofType(notificationGrantRequest),
    switchMap((data) => this.messageService.requestPermission())
  ), {dispatch: false});


  removeNotificationGrant$ = createEffect(() => this.actions$.pipe(
    ofType(removeNotificationGrant),
    switchMap((data) => {
      return this.messageService.removePermission().pipe(
        mergeMap(res => [
          removeNotificationGrantSuccess(),
          message({message: 'Erfolgreich abgemeldet.'})
        ]),
        catchError((error) => of(authConnectError(error)))
      );
    }),
  ));
}
