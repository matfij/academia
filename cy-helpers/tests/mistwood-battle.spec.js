import { test } from '@playwright/test';
import { users } from '../data/users';

const user = users[1];

test('Mistwood auto battle', async ({ page }) => {
    await page.goto('https://mistwood.pl');

    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.locator('button:has-text("Sign in")').nth(1).click();

    await page.waitForSelector('a.flex:has-text("Arena")', { timeout: 10_000 });
    await page.locator('a.flex:has-text("Arena")').nth(0).click();

    while (await page.waitForSelector('button:not(:disabled):has-text("Fight")', { timeout: 10_000 })) {
        await page.locator('button:not(:disabled):has-text("Fight")').nth(0).click();

        await page.waitForSelector('button:has-text("Skip")', { timeout: 10_000 });
        await page.locator('button:has-text("Skip")').nth(0).click();

        await page.waitForSelector('button:has-text("Go back")', { timeout: 10_000 });
        await page.locator('button:has-text("Go back")').nth(0).click();
    }

    console.log('Mistwood auto battle finished');
});
