import {DebugElement, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {List} from '../model/list';
import firebase from 'firebase/app';
import {BaseService} from './base.service';
import {defer} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {CoreState} from '../../core/state/core/reducer';
import {AngularFireAuth} from '@angular/fire/auth';
import {ListActions} from '../state';

@Injectable({providedIn: 'root'})
export class ListService extends BaseService<List> {

  constructor(store: Store<CoreState>, db: AngularFirestore, public afAuth: AngularFireAuth) {
    super('list', store, db);

    afAuth.onAuthStateChanged((user?: firebase.User) => {
      if (user !== null) {
        this.clearSubscription();

        this.addSubscription(db.collection<List>('list',
          ref => ref.where(`owner.${user.uid}`, '==', true))
          .snapshotChanges()
          .pipe(map(actions => {
            return actions.map(action => {
              return <List> {id: action.payload.doc.id, ...action.payload.doc.data()};
            });
          })).subscribe((items) => this.listChanged(items)));
      }
    });
  }

  addList(description: string) {
    return defer(async () => {
      const currentUser = await this.afAuth.currentUser;
      return this.db.collection<List>('list').add({description, owner: {[currentUser.uid]: true}});
    });
  }

  addShareList(listId: string) {

    return defer(async () => {
      const currentUser = await this.afAuth.currentUser;
      return this.db.doc(`list/${listId}`).set({owner: {[currentUser.uid]: true}}, {merge: true});
    });
  }

  removeShareList(listId: string) {
    return defer(async () => {
      const currentUser = await this.afAuth.currentUser;
      return this.db.doc(`list/${listId}`).set({owner: {[currentUser.uid]: false}}, {merge: true});
    });
  }

  listChanged(lists: List[]) {
    this.store.dispatch(ListActions.readList({lists}));
  }
}
