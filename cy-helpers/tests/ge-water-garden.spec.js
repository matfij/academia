import { test } from '@playwright/test';
import { users } from '../data/users';

const user = users[2];
const plant = 'regal_160';

test('Green emporium seed water garden', async ({ page }) => {
    await page.goto('https://www.zieloneimperium.pl/login.php?logout=1&lastServer=1');

    await page.fill('#logout_user', user.email);
    await page.fill('#logout_pass', user.password);
    await page.locator('#submitlogin_logout').click();

    await page.waitForSelector('#watergarden_quick', { timeout: 10_000 });
    await page.locator('#watergarden_quick').click();

    await page.waitForSelector(`#${plant}`, { timeout: 10_000 });
    await page.locator(`#${plant}`).dblclick();

    for (let i = 1; i <= 204; i++) {
        try {
            await page.evaluate(() => watergarden.gridAction(i, 'click'));
        } catch (err) {
            console.log(`Grid no. ${i} blocked (${err})`);
        }
    }
});
