import { Page } from '@playwright/test';


export async function deleteDatabase(page: Page) {
  await page.evaluate(async () => {
    const databases = await window.indexedDB.databases();
    await Promise.all(
      databases.map(({ name }) => {
        return new Promise((resolve, reject) => {
          if(name) {
            const request = window.indexedDB.deleteDatabase(name);
            request.addEventListener('success', resolve);
            request.addEventListener('blocked', resolve);
            request.addEventListener('error', reject);
          }
        });
      })
    );
  });
}

