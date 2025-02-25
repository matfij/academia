import { test } from '@playwright/test';
import { users } from '../data/users';

const user = users[2];
const maxDecorations = 40;
const decorationSelector = 'div.item.boat.part1';
// const decorationSelector = 'div.item.boat2.part1';

test('Green emporium restore park - horizontal', async ({ page }) => {
    await page.goto('https://www.zieloneimperium.pl/login.php?logout=1&lastServer=1');

    await page.fill('#logout_user', user.email);
    await page.fill('#logout_pass', user.password);
    await page.locator('#submitlogin_logout').click();

    await page.waitForSelector('#park_quick', { timeout: 10_000 });
    await page.locator('#park_quick').click();

    if (page.getByText('Nie ma dekoracji do odnowienia.')) {
        return console.log('Green emporium restore park not needed');
    }

    let decorationIndex = 0;

    while (decorationIndex < maxDecorations) {
        await page.waitForSelector(decorationSelector, { timeout: 1000 });
        await page.locator(decorationSelector).nth(decorationIndex).click();

        const renewButton = page.locator('div.scalebutton.link:has-text("Odnów")');
        const renewFunction = await renewButton.getAttribute('onclick');

        await page.evaluate((onclick) => {
            const func = new Function(onclick);
            func();
        }, renewFunction);

        decorationIndex++;
    }

    console.log(`Green emporium restore park finished - horizontal (${decorationIndex})`);
});
