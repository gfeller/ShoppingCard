import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {Item} from '../model/item';

import * as moment from 'moment';
import {BaseService} from './base.service';
import {of} from 'rxjs';
import firebase from 'firebase/app';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {CoreState} from '../../core/state/core/reducer';
import {ItemsActions, ListActions} from '../state';


const momentConstructor = moment;

@Injectable({providedIn: 'root'})
export class ItemService extends BaseService<Item> {
  constructor(store: Store<CoreState>, db: AngularFirestore, public afAuth: AngularFireAuth) {
    super('item', store, db);
  }

  getFromList(id: string) {
    this.clearSubscription();

    this.addSubscription(this.collectionQuery(
      ref => ref.where('listId', '==', id).where('boughtAt', '==', null))
      .stateChanges().subscribe((items) => this.listChanged(id, items)));

    this.addSubscription(this.collectionQuery(
      ref => ref.where('listId', '==', id)
        .where('boughtAt', '>', momentConstructor().subtract(1, 'days').toDate()))
      .stateChanges().subscribe((items) => this.listChanged(id, items)));

    return of(true);
  }

  async add(item: Item) {
    item = {...item};
    item.boughtAt = null;
    item.createdAt = firebase.firestore.Timestamp.now();
    item.createdBy = (await this.afAuth.currentUser).uid;
    return super.add(item);
  }

  listChanged(id: string, items: DocumentChangeAction<Item>[]) {
    let type: string;
    let counter = -1;
    const toSend: DocumentChangeAction<Item>[][] = [];

    for (const item of items) {
      if (type !== item.type) {
        counter++;
        toSend[counter] = [];
        type = item.type;
      }
      toSend[counter].push(item);
    }
    for (const action of toSend.filter(x => x.length > 0)) {
      if (action[0].type === 'added' || action[0].type === 'modified') {
        this.store.dispatch(ListActions.loadListSuccess({
          id, items: action.map((item) => <Item> {id: item.payload.doc.id, ...item.payload.doc.data()})
        }));
      } else if (action[0].type === 'removed') {
        this.store.dispatch(ItemsActions.removeSuccess({ids: action.map((item) => item.payload.doc.id)}));
      }
    }
  }
}
