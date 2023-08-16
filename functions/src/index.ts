import {EventContext} from 'firebase-functions';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


exports.fcmSend = functions.firestore.document('item/{itemId}')
  .onCreate((snapshot: any, context: EventContext) => {
    const data = snapshot.data();
    const targetId = context.params.itemId;
    const containerId = data.listId;
    const createdBy = data.createdBy;
    const payload = {
      notification: {
        title: 'Neuer Eintrag: ' + data.description,
        body: '',
        click_action: 'https://ikaufzetteli.firebaseapp.com/list/' + data.listId,
        icon: '/favicon.ico',
        tag: data.listId,
        // 'sound': 'default' //<-- wenn man sowas möchte :)
      },
      data: {
        type: 'item',
        targetId: targetId,
        containerId: containerId
      }
    };


    return admin.firestore().collection('list').doc(data.listId).get().then(list => {
      const listData = list.data();
      payload.notification.body = `in der Liste ${listData.description}`;
      return Object.keys(listData.owner).filter(x => x !== createdBy).filter(x => listData.owner[x]);
    }).then(owners => {
      return admin.firestore().getAll(...owners.map(owner => admin.firestore().doc('fcmTokens/' + owner)));
    }).then(docs => {
      return docs.map(x => x.data());
    }).then(docs => {
      docs.filter(doc => doc !== undefined).forEach(doc => {
        return admin.messaging().sendToDevice(doc.token, payload);
      });
    }).catch(err => console.log(err));
  });
