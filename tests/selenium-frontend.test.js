const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function studentTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        
        await driver.get('http://localhost:5050/manageStudent.html');

        //  Click the visible "Add New Student" button to open modal
        const openModalBtn = await driver.wait(
            until.elementLocated(By.css("button.btn.btn-primary[onclick='addpopup()']")),
            10000
        );
        await driver.wait(until.elementIsVisible(openModalBtn), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", openModalBtn);
        await openModalBtn.click();

        //  Wait until the modal is visible
        const modal = await driver.wait(
            until.elementLocated(By.id('popupmodal')),
            5000
        );
        await driver.wait(until.elementIsVisible(modal), 5000);

        //  interact with the matric input
        const matricInput = await driver.wait(
            until.elementLocated(By.id('matriculationNumber')),
            5000
        );
        await driver.wait(until.elementIsVisible(matricInput), 5000);
        await matricInput.sendKeys('2401234A');

        //  Check the email auto-fill
        const emailInput = await driver.findElement(By.id('email'));
        await driver.wait(async () => {
            const value = await emailInput.getAttribute('value');
            return value === '2401234A@student.tp.edu.sg';
        }, 5000);

        const emailValue = await emailInput.getAttribute('value');
        assert.strictEqual(emailValue, '2401234A@student.tp.edu.sg');

        console.log("Selenium Test Passed: Email auto-filled correctly!");
    } finally {
        await driver.quit();
    }
})();
