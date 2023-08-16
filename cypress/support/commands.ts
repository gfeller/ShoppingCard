declare namespace Cypress {
  interface Chainable<Subject = any> {
    deleteDatabase(): Chainable;
  }
}

Cypress.Commands.add('deleteDatabase', () => {
  return cy.window().then(x => {
    x.indexedDB.deleteDatabase('firebase-installations-database');
    x.indexedDB.deleteDatabase('firebase-messaging-database');
    x.indexedDB.deleteDatabase('firebaseLocalStorageDb');
    x.indexedDB.deleteDatabase('firestore/[DEFAULT]/ikaufzetteli/main');
  });
});
