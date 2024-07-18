import {EventEmitter, inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {Item, ItemAddViewModel} from '../model/item';

import moment from 'moment';
import {BaseService} from './base.service';
import {of} from 'rxjs';
import {Timestamp} from 'firebase/firestore';
import {Auth} from '@angular/fire/auth';
import {collectionChanges, DocumentChange, Firestore, where} from '@angular/fire/firestore';
import {CoreState} from '../../core/state/core/reducer';

const momentConstructor = moment;

@Injectable({providedIn: 'root'})
export class ItemService extends BaseService<Item> {
  onAdd = new EventEmitter<Item[]>()
  onRemove = new EventEmitter<string[]>()

  constructor(store: Store<CoreState>, db: Firestore, public afAuth: Auth) {
    super('item', store, db);
  }

  getFromList(id: string) {
    this.clearSubscription();

    const query = this.collectionQuery(where('listId', '==', id), where('boughtAt', '==', null));
    this.addSubscription(collectionChanges<Item>(query).subscribe((items) => this.listChanged(id, items)));

    const query2 = this.collectionQuery(where('listId', '==', id), where('boughtAt', '>', momentConstructor().subtract(1, 'days').toDate()));
    this.addSubscription(collectionChanges<Item>(query2).subscribe((items) => this.listChanged(id, items)));
  }

  override async add(item: ItemAddViewModel) {
    const toAddItem: Omit<Item, "id"> = {
      ...item,
      boughtAt: null,
      createdAt: Timestamp.now(),
      createdBy: (await this.afAuth.currentUser)!.uid
    };
    return super.add(toAddItem);
  }

  listChanged(id: string, items: DocumentChange<Item>[]) {
    let type: string | undefined = undefined;
    let counter = -1;
    const toSend: DocumentChange<Item>[][] = [];

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
        this.onAdd.emit(action.map((item) => ({ ...item.doc.data(), id: item.doc.id})))

      } else if (action[0].type === 'removed') {
        this.onRemove.emit(action.map((item) => item.doc.id))
      }
    }
  }
}
