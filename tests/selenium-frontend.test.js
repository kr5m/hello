const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome'); // 1. Add this import

test('Should auto-fill email when matriculation number is entered', async () => {
    // 2. Configure headless options
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    // 3. Build the driver with these options
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get('http://localhost:5050/manageStudent.html');
        // ... the rest of your test code ...
    } finally {
        await driver.quit();
    }
}, 30000);