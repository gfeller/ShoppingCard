import {createReducer, on} from '@ngrx/store';
import {AuthUser} from './model';
import * as Actions from './actions';
import {NotificationData} from './actions';


export interface CoreState {
  online: boolean;
  user?: AuthUser | null;
  messages: any[];
  notifications: NotificationData[];
  notificationToken: string | null;
  isMobile: boolean;
}

export const initialState: CoreState = {
  online: navigator.onLine,
  user: null,
  messages: [],
  notifications: [],
  notificationToken: null,
  isMobile: true,
};

export const reducer = createReducer(
  initialState,
  on(Actions.init, (state, {}) => ({...initialState})),
  on(Actions.netState, (state, action) => ({...state, online: action.online})),
  on(Actions.netState, (state, action) => ({...state, online: action.online})),
  on(Actions.uiInformationChanged, (state, action) => ({...state, isMobile: action.info.isMobile})),
  on(Actions.notificationGrantExist, Actions.notificationGrantSuccess, (state, action) => ({...state, notificationToken: action.token})),
  on(Actions.notificationGrantForbidden, Actions.removeNotificationGrant, (state) => ({...state, notificationToken: null})),
  on(Actions.notificationSuccess, (state, action) => ({...state, notifications: [...state.notifications, action]})),
  on(Actions.removeNotification, (state, data) => {
    const {containerId, targetId} = data;
    return {
      ...state,
      notifications: state.notifications.filter(n => n.data.containerId !== containerId && n.data.targetId !== targetId)
    };
  }),
  on(Actions.authChanged, (state, action) => ({...state, user: action})),
  on(Actions.message, (state, action) => ({
    ...state,
    messages: [...state.messages, {id: new Date().toISOString(), message: action.message, type: action.type}]
  })),
  on(Actions.removeMessage, (state, action) => ({...state, messages: state.messages.filter(x => x.id !== action.item.id)})),
);


