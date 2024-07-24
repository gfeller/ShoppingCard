import {Subscription} from 'rxjs';
import {DTO} from '../../core/model/dto';

import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  query,
  QueryConstraint,
  updateDoc
} from '@angular/fire/firestore';

export abstract class BaseService<T extends DTO> {
  private subscription: Subscription[] = [];

  protected constructor(protected collectionName: string, protected db: Firestore) {

  }

  clearSubscription() {
    this.subscription.forEach(x => x.unsubscribe());
    this.subscription = [];
  }

  addSubscription(subscription: Subscription) {
    this.subscription.push(subscription);
  }

  get collection() {
    return collection(this.db, this.collectionName) as CollectionReference<Omit<T, "id">, T>;
  }

  collectionQuery(...queryConstraints: QueryConstraint[]) {
    const baseCollection = collection(this.db, this.collectionName);
    return query<T, T>(baseCollection as CollectionReference<T,T>, ...queryConstraints); // HACK because no collection<T>
  }

  getDoc(id: string) {
    return doc(this.db, `${this.collectionName}/${id}`);
  }

  async add(item: Omit<T, "id">) {
    return addDoc(this.collection, item);
  }

  update(item: T) {
    return updateDoc(this.getDoc(item.id!), item as any);
  }

  remove(id: string) {
    return deleteDoc(this.getDoc(id));
  }
}
