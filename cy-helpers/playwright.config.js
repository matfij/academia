const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    timeout: 1_000_000,
    use: {
        headless: true,
        viewport: { width: 1600, height: 1000 },
        ignoreHTTPSErrors: true,
        trace: 'on',
        screenshot: 'on',
        channel: 'chrome',
        video: 'on',
    },
});
