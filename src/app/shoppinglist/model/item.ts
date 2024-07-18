import {Timestamp} from 'firebase/firestore';
import {DTO} from '../../core/model/dto';


export interface Item extends DTO {
  boughtAt: Timestamp | null ;
  createdAt: Timestamp;
  createdBy: string;
  description: string;
  listId: string;
}


export interface ItemAddViewModel  {
  description: string;
  listId: string;
}
