import {AppPage} from '../pages/app.po';

describe('My First Test', () => {

  let page: AppPage;

  beforeEach(() => {
    cy.deleteDatabase();

    cy.clearCookies();
    cy.clearLocalStorage();

    page = new AppPage();
  });

  it('login user', async () => {
    const user = 'test_1@test.ch';

    page.navigateTo();

    page.getLogin().should('exist').and('not.have.text', user);
    // page.getLogin().then(x => expect(x.text().length).to.be.eq(10)); // or work with jQuery Object

    // cy.debug() // debug cypress

    page.getLoginButton().click();
    page.getAnonymousEmail().type(user);
    page.getAnonymousPwd().type('12345678');
    page.getRegisterButton().click();

    page.getLogin().should('have.text', user);
  });
});
