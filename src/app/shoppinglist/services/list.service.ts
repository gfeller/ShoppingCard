import {EventEmitter, inject, Injectable, Injector} from '@angular/core';
import {Store} from '@ngrx/store';

import {List} from '../model/list';
import {BaseService} from './base.service';
import {map} from 'rxjs/operators';

import {Auth} from '@angular/fire/auth';
import {addDoc, doc, Firestore, fromRef, setDoc, where} from '@angular/fire/firestore';

import {CoreState} from '../../core/state/core/reducer';

@Injectable({providedIn: 'root'})
export class ListService extends BaseService<List> {
  onChanged = new EventEmitter<List[]>()

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

  async addList(description: string) {
    const currentUser = this.afAuth.currentUser!;
    return addDoc(this.collection, {description, owner: {[currentUser.uid]: true}});
  }

  async addShareList(listId: string) {
    const currentUser = this.afAuth.currentUser!;
    return setDoc(doc(this.db, `list/${listId}`), {owner: {[currentUser.uid]: true}}, {merge: true});
  }

  async  removeShareList(listId: string) {
    const currentUser = this.afAuth.currentUser!;
    return setDoc(doc(this.db, `list/${listId}`), {owner: {[currentUser.uid]: false}}, {merge: true});
  }

  listChanged(lists: List[]) {
    this.onChanged.emit(lists)
  }
}
