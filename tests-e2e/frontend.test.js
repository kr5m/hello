    import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5050/manageStudent.html';

test.describe('Lance Goh - Student Management UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
    });

    test('Should auto-fill email correctly when matriculation number is entered', async ({ page }) => {
        // FIX: Only click the button that is visible on the main page
        await page.locator('button:has-text("Add New Student")').filter({ visible: true }).click();

        await page.fill('#matriculationNumber', '2401234A');

        // Wait for the JS logic to trigger
        const emailValue = await page.inputValue('#email');
        expect(emailValue).toBe('2401234A@student.tp.edu.sg');
    });

    //  Test: Boundary Validation for "Year"
    test('Should prevent submission if year is outside 1-3 range', async ({ page }) => {
        await page.locator('button:has-text("Add New Student")').filter({ visible: true }).click();

        const yearInput = page.locator('#year');
        await yearInput.fill('5'); // Invalid boundary

        // Check browser-level validation (HTML5)
        const isValid = await yearInput.evaluate(node => node.checkValidity());
        expect(isValid).toBe(false);
    });

    //  Test: Modal Exit Control
    test('Should close the modal when the "Close" button is clicked', async ({ page }) => {
        await page.locator('button:has-text("Add New Student")').filter({ visible: true }).click();

        // Ensure modal is open
        await expect(page.locator('#popupmodal')).toBeVisible();

        // Click Close
        await page.click('button:has-text("Close")');

        // Assert: Modal is hidden
        await expect(page.locator('#popupmodal')).toBeHidden();
    });
});
