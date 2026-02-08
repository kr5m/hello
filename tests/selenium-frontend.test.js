const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { spawn } = require('child_process');
const path = require('path');

let driver;
let serverProcess;

beforeAll((done) => {
    // 1. Start the server
    serverProcess = spawn('node', [path.join(__dirname, '../index.js')]);

    // Wait until server logs "Project URL" or 5050 is ready
    serverProcess.stdout.on('data', (data) => {
        if (data.toString().includes('Project URL')) {
            done();
        }
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`Server error: ${data}`);
    });
});

afterAll(async () => {
    // 2. Stop the server
    serverProcess.kill();
    if (server && server.close) {
        await server.close();
    }
    // Quit driver if it exists
    if (driver) {
        await driver.quit();
    }
});

test('Should auto-fill email when matriculation number is entered', async () => {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    await driver.get('http://localhost:5050/manageStudent.html');

    // ... the rest of your Selenium test ...
}, 30000);
