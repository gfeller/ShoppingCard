import {ActionReducerMap, createSelector, MetaReducer} from '@ngrx/store';

import {CoreState, reducer as coreReducer} from './core/reducer';
import {environment} from '../../../environments/environment';

import * as CoreActions from './core/actions';

export {CoreActions};

export interface State {
  core: CoreState;
}

export const reducers: ActionReducerMap<State> = {
  core: coreReducer
};

export const metaReducers: MetaReducer<State>[] = [];

export const selectCore = (state: State) => state.core;

export const selectIsReady = createSelector(selectCore, x => x.init.auth && x.init.messaging);

export const selectIsOnline = createSelector(selectCore, x => x.online);
export const selectIsMobile = createSelector(selectCore, x => x.isMobile);
export const selectNotificationToken = createSelector(selectCore, x => x.notificationToken);
export const selectUser = createSelector(selectCore, x => x.user!);
export const selectMessages = createSelector(selectCore, x => x.messages);
export const selectNotifications = createSelector(selectCore, x => x.notifications);
export const selectNotificationForList = (id : string) => {
  return createSelector(selectCore, x => x.notifications.filter(notification => notification.data.containerId === id));
};

