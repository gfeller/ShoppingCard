import { test, expect } from '@playwright/test';
import { AppPage } from './app.page';
import {deleteDatabase} from './test.utils';

test.describe('My First Test', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }) => {
    // Assuming deleteDatabase, clearCookies, and clearLocalStorage are custom functions
    appPage = new AppPage(page);
    await appPage.navigateTo();
    await deleteDatabase(page);
    await page.context().clearCookies();
    await page.context().clearPermissions();

  });

  test('login user', async ({ page }) => {
    const user = 'test_1@test.ch';
    await appPage.navigateTo();
    await expect(appPage.getLogin()).toBeVisible();
    await expect(appPage.getLogin()).not.toHaveText(user);

    await appPage.getLoginButton().click();

    await appPage.getAnonymousEmail().fill(user);
    await appPage.getAnonymousPwd().fill('12345678');
    await appPage.getRegisterButton().click();
    await expect(appPage.getLogin()).toHaveText(user);
  });
});

