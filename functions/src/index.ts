import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

// Initialize the Firebase app
initializeApp({
  credential: applicationDefault(),
});

// Define the Firestore trigger function
exports.fcmSend = onDocumentCreated('item/{itemId}', async (event) => {
  const data = event.data.data();
  const targetId = event.params.itemId;
  const containerId = data.listId;
  const payload = {
    notification: {
      title: 'Neuer Eintrag: ' + data.description,
      body: '',
      click_action: 'https://ikaufzetteli.firebaseapp.com/list/' + data.listId,
      icon: '/favicon.ico',
      tag: data.listId,
    },
    data: {
      type: 'item',
      targetId: targetId,
      containerId: containerId,
    },
  };

  const message = {
    token: '',
    data: {
      type: 'item',
      targetId: targetId,
      containerId: containerId,
    },
    notification: {
      title: 'Neuer Eintrag: ' + data.description,
      body: '',
    },
    webpush: {
      notification: {
        tag: data.listId,
        icon: '/favicon.ico',
        vibrate: 3,
      },
      fcmOptions: {
        link: 'https://ikaufzetteli.firebaseapp.com/list/' + data.listId,
      },
    },
  };

  logger.warn(message);

  try {
    const listDoc = await getFirestore().collection('list').doc(data.listId).get();
    const listData = listDoc.data();

    if (listData) {
      payload.notification.body = `in der Liste ${listData.description}`;
      const ownerRefs = Object.keys(listData.owner).map(owner => getFirestore().doc('fcmTokens/' + owner));
      const ownerDocs = await getFirestore().getAll(...ownerRefs);

      ownerDocs
        .map(doc => doc.data())
        .filter(doc => doc !== undefined)
        .forEach(doc => {
          if (doc && doc.token) {
            logger.log(message, doc.token);
            getMessaging().send({ ...message, token: doc.token });
          }
        });
    }
  } catch (err) {
    console.log(err);
  }
});
