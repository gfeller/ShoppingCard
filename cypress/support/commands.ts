declare namespace Cypress {
  interface Chainable<Subject = any> {
    deleteDatabase(): Chainable;
  }
}


Cypress.Commands.add('deleteDatabase', () => {
  return cy.window().then(x => {
    return window.indexedDB.databases().then(databases => {
        return   Promise.all(
          databases.map(
            ({name}) =>
              new Promise((resolve, reject) => {
                const request = window.indexedDB.deleteDatabase(name!);
                request.addEventListener('success', resolve);
                request.addEventListener('blocked', resolve);
                request.addEventListener('error', reject);
              }),
          ),
        );
    })
  });
});
