export class AppPage {
  navigateTo() {
    return cy.visit('/');
  }

  getLoginButton() {
    return cy.get('[data-test-id=user-settings]');
  }

  getLogin() {
    return cy.get('[data-test-id=user-name]');
  }

  getAnonymousLoginCard() {
    return cy.get('[data-test-id=anonymous-login-card]');
  }

  getAnonymousEmail() {
    return cy.get('[data-test-id=anonymous-login-card] input[type=email]');
  }

  getAnonymousPwd() {
    return cy.get('[data-test-id=anonymous-login-card] input[type=password]');
  }

  getRegisterButton() {
    return cy.get('[data-test-id=anonymous-login-card] button:nth-of-type(2)');
  }
}
