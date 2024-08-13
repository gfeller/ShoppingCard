import { Page } from '@playwright/test';

export class AppPage {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto('http://localhost:4200');
  }

  getLoginButton() {
    return this.page.locator('[data-test-id=user-settings]');
  }

  getLogin() {
    return this.page.locator('[data-test-id=user-name]');
  }

  getAnonymousLoginCard() {
    return this.page.locator('[data-test-id=anonymous-login-card]');
  }

  getAnonymousEmail() {
    return this.page.locator('[data-test-id=anonymous-login-card] input[type=email]');
  }

  getAnonymousPwd() {
    return this.page.locator('[data-test-id=anonymous-login-card] input[type=password]');
  }

  getRegisterButton() {
    return this.page.locator('[data-test-id=anonymous-login-card] button:nth-of-type(2)');
  }
}
