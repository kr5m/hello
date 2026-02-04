const request = require('supertest');
const { app, server } = require('../index');
const fs = require('fs').promises;
const path = require('path');

describe('Lance Goh - Student Management API - Full Coverage Suite', () => {
    const filePath = path.join('utils', 'studentDetails.json');
    let originalData;

    beforeAll(async () => {
        originalData = await fs.readFile(filePath, 'utf8');
    });

    afterEach(async () => {
        await fs.writeFile(filePath, originalData, 'utf8');
        jest.restoreAllMocks();
    });

    afterAll((done) => {
        server.close(done);
    });

    // TEST 1: Success Scenario
    test('POST /add-student - Should successfully add a new student', async () => {
        const res = await request(app).post('/add-student').send({
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

    // TEST 2: Missing Fields (Negative)
    test('POST /add-student - Should return 400 if required fields are missing', async () => {
        const res = await request(app).post('/add-student').send({ name: "Incomplete" });
        expect(res.statusCode).toBe(400);
    });

    // TEST 4: Duplicate Student
    test('POST /add-student - Should return 400 for duplicate matriculation number', async () => {
        const studentData = {
            name: "Muthiah",
            matriculationNumber: "2402087G", // Existing ID in your JSON
            courseID: "T63",
            email: "m@tp.edu.sg",
            year: 2
        };
        await request(app).post('/add-student').send(studentData); // Ensure it's there
        const res = await request(app).post('/add-student').send(studentData);
        expect(res.statusCode).toBe(400);
    });

    // TEST 6: Unexpected Server Error (Mocked)
    test('POST /add-student - Should return 500 for unexpected server errors', async () => {
        jest.spyOn(JSON, 'parse').mockImplementation(() => {
            throw new Error("Simulated Server Error");
        });

        const res = await request(app).post('/add-student').send({
            name: "Error Test",
            matriculationNumber: "E" + Date.now(),
            courseID: "T63",
            email: "error@tp.edu.sg", // Must end in @tp.edu.sg
            year: 1,                 // Must be 1, 2, or 3
            phoneNumber: "87654321",
            className: "C24",
            houseAddress: "Block 1"
        });

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Simulated Server Error");
    });

    // TEST 8: JSON Parsing Failure of Template
    test('POST /add-student - Should return 500 if template file contains invalid JSON', async () => {
        const readFileSpy = jest.spyOn(fs, 'readFile');
        readFileSpy.mockRejectedValueOnce({ code: 'ENOENT' }); // Resource missing
        readFileSpy.mockResolvedValueOnce("invalid-json-content"); // Template corrupt

        const res = await request(app).post('/add-student').send({
            name: "Corrupt User",
            matriculationNumber: "C" + Date.now(),
            courseID: "T63",
            email: "test@tp.edu.sg",
            year: 1
        });

        expect(res.statusCode).toBe(500);
    });
});