const request = require('supertest');
const { app } = require('../index'); // ✅ ONLY import app
const fs = require('fs').promises;
const path = require('path');

describe('Lance Goh - Student Management API - Full Coverage Suite', () => {

    const filePath = path.join('utils', 'studentDetails.json');
    let originalData;

    // Save original JSON before tests
    beforeAll(async () => {
        originalData = await fs.readFile(filePath, 'utf8');
    });

    // Restore JSON after each test
    afterEach(async () => {
        await fs.writeFile(filePath, originalData, 'utf8');
        jest.restoreAllMocks();
    });

    // Final restore (no server closing needed)
    afterAll(async () => {
        await fs.writeFile(filePath, originalData, 'utf8');
    });

    // ---------------- TESTS ----------------

    test('POST /add-student - Should successfully add a new student', async () => {
        const res = await request(app)
            .post('/add-student')
            .send({
                name: "Lance Goh",
                matriculationNumber: "L" + Date.now(),
                courseID: "T63",
                houseAddress: "123 Tampines St 11",
                phoneNumber: "81234567",
                email: "test@student.tp.edu.sg",
                year: 1,
                className: "C24BO1"
            });

        expect(res.statusCode).toBe(201);
    });

    test('POST /add-student - Should return 400 if required fields are missing', async () => {
        const res = await request(app)
            .post('/add-student')
            .send({
                name: "Incomplete User"
            });

        expect(res.statusCode).toBe(400);
    });

    test('POST /add-student - Should return 400 for duplicate matriculation number', async () => {
        const studentData = {
            name: "Muthiah",
            matriculationNumber: "2402087G",
            courseID: "T63",
            email: "m@tp.edu.sg",
            year: 2
        };

        const res = await request(app)
            .post('/add-student')
            .send(studentData);

        expect(res.statusCode).toBe(400);
    });

    test('POST /add-student - Should handle forced JSON parse errors', async () => {
        jest.spyOn(JSON, 'parse').mockImplementation(() => {
            throw new Error("Simulated Server Error");
        });

        const res = await request(app)
            .post('/add-student')
            .send({
                name: "Lance Test",
                matriculationNumber: "L" + Date.now(),
                courseID: "T63",
                email: "test@tp.edu.sg",
                year: 1,
                phoneNumber: "81234567",
                className: "P01",
                houseAddress: "TP"
            });

        expect([400, 500]).toContain(res.statusCode);
    });

    test('POST /add-student - Should handle corrupt JSON template', async () => {
        const readFileSpy = jest.spyOn(require('fs').promises, 'readFile');

        readFileSpy.mockRejectedValueOnce({ code: 'ENOENT' });
        readFileSpy.mockResolvedValueOnce("invalid-json-content");

        const res = await request(app)
            .post('/add-student')
            .send({
                name: "Corrupt User",
                matriculationNumber: "C" + Date.now(),
                courseID: "T63",
                email: "test@tp.edu.sg",
                year: 1
            });

        expect([400, 500]).toContain(res.statusCode);
    });

});
