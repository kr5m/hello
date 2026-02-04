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

    // TEST 6: Unexpected Server Error (MOCKED)
    test('POST /add-student - Should return 500 for unexpected server errors', async () => {
        // Force an error during JSON processing
        jest.spyOn(JSON, 'parse').mockImplementation(() => {
            throw new Error("Simulated Server Error");
        });

        const res = await request(app).post('/add-student').send({
            name: "Error Test",
            matriculationNumber: "E" + Date.now(),
            courseID: "T63",
            email: "error@tp.edu.sg",
            year: 1,
            phoneNumber: "87654321",
            className: "C24",
            houseAddress: "Block 1"
        });

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Simulated Server Error");
    });

    // TEST 7: Recovery Failure - Template File Missing
    test('POST /add-student - Should return 500 if both resource and template files are missing', async () => {
        const readFileSpy = jest.spyOn(fs, 'readFile');
        readFileSpy.mockRejectedValueOnce({ code: 'ENOENT' }); // Resource fails
        readFileSpy.mockRejectedValueOnce(new Error("Template Access Denied")); // Template fails

        const res = await request(app).post('/add-student').send({
            name: "Fail User",
            matriculationNumber: "F" + Date.now(),
            courseID: "T63",
            email: "f@tp.edu.sg",
            year: 1
        });

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Template Access Denied");
    });
});