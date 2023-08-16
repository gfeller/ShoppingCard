import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {List} from '../model/list';
import {BaseService} from './base.service';
import {defer} from 'rxjs';
import {map} from 'rxjs/operators';

import {Auth} from '@angular/fire/auth';
import {addDoc, doc, Firestore, fromRef, setDoc, where} from '@angular/fire/firestore';

import {CoreState} from '../../core/state/core/reducer';

import {ListActions} from '../state';
import {User} from 'firebase/auth';


@Injectable({providedIn: 'root'})
export class ListService extends BaseService<List> {

  constructor(store: Store<CoreState>, db: Firestore, public afAuth: Auth) {
    super('list', store, db);

    afAuth.onAuthStateChanged((user) => {
      if (user !== null) {
        this.clearSubscription();

        const query = this.collectionQuery(where(`owner.${user!.uid}`, '==', true));

        this.addSubscription(fromRef(query, {includeMetadataChanges: true}).pipe(
          map(it => it.docs.map(change => ({
            ...change.data() as List,
            id: change.id,
          })))
        ).subscribe((items) => this.listChanged(items)));
      }
    });
  }

  addList(description: string) {
    return defer(async () => {
      const currentUser = await this.afAuth.currentUser!;
      return addDoc(this.collection, {description, owner: {[currentUser.uid]: true}});
    });
  }

  addShareList(listId: string) {

    return defer(async () => {
      const currentUser = await this.afAuth.currentUser!;
      return setDoc(doc(this.db, `list/${listId}`), {owner: {[currentUser.uid]: true}}, {merge: true});
    });
  }

  removeShareList(listId: string) {
    return defer(async () => {
      const currentUser = await this.afAuth.currentUser!;
      return setDoc(doc(this.db, `list/${listId}`), {owner: {[currentUser.uid]: false}}, {merge: true});
    });
  }

  listChanged(lists: List[]) {
    this.store.dispatch(ListActions.readList({lists}));
  }
}
