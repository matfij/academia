import { test } from '@playwright/test';
import { users } from '../data/users';

const user = users[2];

const execute = async (functionString) =>
    await page.evaluate((onclick) => {
        const func = new Function(onclick);
        func();
    }, functionString);

const setup = async () => {
    await page.goto('https://www.zieloneimperium.pl/login.php?logout=1&lastServer=1');

    await page.fill('#logout_user', user.email);
    await page.fill('#logout_pass', user.password);
    await page.locator('#submitlogin_logout').click();

    await page.waitForSelector('#park_quick', { timeout: 10_000 });
    await page.locator('#park_quick').click();

    if (page.getByText('Nie ma dekoracji do odnowienia.')) {
        return console.log('Green emporium restore park not needed');
    }
};

test('Green emporium restore park - horizontal', async ({ page }) => {
    await setup();

    let decorationIndex = 0;

    while (decorationIndex < 25) {
        await page.waitForSelector('div.item.boat.part1', { timeout: 1000 });
        await page.locator('div.item.boat.part1').nth(decorationIndex).click();

        const element = page.locator('div.scalebutton.link:has-text("Odnów")');
        const onclickValue = await element.getAttribute('onclick');
        await execute(onclickValue);

        decorationIndex++;
    }

    console.log(`Green emporium restore park finished - horizontal (${decorationIndex})`);
});

test('Green emporium restore park - vertical', async ({ page }) => {
    await setup();

    let decorationIndex = 0;

    while (decorationIndex < 25) {
        await page.waitForSelector('div.item.boat2.part1', { timeout: 1000 });
        await page.locator('div.item.boat2.part1').nth(decorationIndex).click();

        const element = page.locator('div.scalebutton.link:has-text("Odnów")');
        const onclickValue = await element.getAttribute('onclick');
        await execute(onclickValue);

        decorationIndex++;
    }

    console.log(`Green emporium restore park finished - vertical (${decorationIndex})`);
});
