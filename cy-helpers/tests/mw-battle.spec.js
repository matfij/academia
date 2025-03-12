import { test } from '@playwright/test';
import { users } from '../data/users';

const user = users[1];

test('Mistwood auto battle', async ({ page }) => {
    await page.goto('https://mistwood.pl');

    await page.locator('button:has-text("Zaloguj")').nth(0).click();
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.locator('button:has-text("Zaloguj się")').nth(0).click();
    
    await page.waitForSelector('a.flex:has-text("Arena")', { timeout: 30_000 });
    await page.locator('a.flex:has-text("Arena")').nth(0).click();

    try {
        while (await page.waitForSelector('button:not(:disabled):has-text("Walcz")', { timeout: 30_000 })) {
            await page.locator('button:not(:disabled):has-text("Walcz")').nth(0).click();

            await page.waitForSelector('button:has-text("Pomiń")', { timeout: 30_000 });
            await page.locator('button:has-text("Pomiń")').nth(0).click();

            await page.waitForSelector('button:has-text("Powrót")', { timeout: 30_000 });
            await page.locator('button:has-text("Powrót")').nth(0).click();
        }
    } catch {
        page.evaluate('location.reload();');
    }

    console.log('Mistwood auto battle finished');
});
