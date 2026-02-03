const request = require('supertest');
const { app, server } = require('../index');
const fs = require('fs').promises;
const path = require('path');

describe('Lance Goh - Student Management API - Full Coverage Suite', () => {
    const filePath = path.join('utils', 'studentDetails.json');
    let originalData;

    // Load original data to restore after tests [cite: 93, 188]
    beforeAll(async () => {
        originalData = await fs.readFile(filePath, 'utf8');
    });

    // Restore original file state and clear mocks after each test 
    afterEach(async () => {
        await fs.writeFile(filePath, originalData, 'utf8');
        jest.restoreAllMocks();
    });

    // Close server to prevent Jest from hanging 
    afterAll((done) => {
        server.close(done);
    });

    // TEST 1: Success Scenario (Positive Test) 
    test('POST /add-student - Should successfully add a new student', async () => {
        const res = await request(app)
            .post('/add-student')
            .send({
                name: "Lance Goh",
                matriculationNumber: "2402099X",
                courseID: "T63",
                houseAddress: "123 Tampines St 11",
                phoneNumber: "81234567",
                email: "2402099X@student.tp.edu.sg",
                year: 1,
                className: "C24BO1"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.matriculationNumber).toBe("2402099X");
    });

    // TEST 2: Validation Failure - Missing Fields (Negative Test) 
    // This targets Line 18 in your utility file
    test('POST /add-student - Should return 400 if required fields are missing', async () => {
        const res = await request(app)
            .post('/add-student')
            .send({
                name: "Incomplete User"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Missing required fields");
    });

    // TEST 3: Validation Failure - Invalid Year (Edge Case) 
    test('POST /add-student - Should return 400 if year is out of range', async () => {
        const res = await request(app)
            .post('/add-student')
            .send({
                name: "Boundary User",
                matriculationNumber: "240001B",
                courseID: "T63",
                email: "test@tp.edu.sg",
                year: 5 // Invalid: Max is 3
            });

        expect(res.statusCode).toBe(400);
    });

    // TEST 4: Edge Case - Duplicate Student 
    test('POST /add-student - Should return 400 for duplicate matriculation number', async () => {
        const studentData = {
            name: "Muthiah",
            matriculationNumber: "2402087G", // ID from your existing JSON
            courseID: "T63",
            email: "m@tp.edu.sg",
            year: 2
        };

        const res = await request(app).post('/add-student').send(studentData);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("already exists");
    });

    // TEST 5: Recovery -
    test('POST /add-student - Should create file from template if missing', async () => {
        jest.spyOn(fs, 'readFile').mockRejectedValueOnce({ code: 'ENOENT' });

        const res = await request(app).post('/add-student').send({
            name: "Temp User",
            matriculationNumber: "240002T",
            courseID: "T63",
            email: "t@tp.edu.sg",
            year: 1
        });

        expect(res.statusCode).toBe(201);
    });

    // TEST 6: Unexpected Server Error
    test('POST /add-student - Should return 500 for unexpected server errors', async () => {
        // Mocking the error
        jest.spyOn(JSON, 'parse').mockImplementation(() => {
            throw new Error("Simulated Server Error");
        });

        const res = await request(app).post('/add-student').send({
            name: "Valid Name",
            matriculationNumber: "2499999Z", // Make sure this is unique
            courseID: "T63",
            email: "test@tp.edu.sg",
            year: 1, // Must be 1, 2, or 3
            phoneNumber: "81234567",
            className: "P01",
            houseAddress: "123 TP Street"
        });

        expect(res.statusCode).toBe(500);
    });

    // TEST 7: Recovery Failure - Template File Missing
    test('POST /add-student - Should return 500 if both resource and template files are missing', async () => {
        const readFileSpy = jest.spyOn(fs, 'readFile');
        readFileSpy.mockRejectedValueOnce({ code: 'ENOENT' }); // Resource fails
        readFileSpy.mockRejectedValueOnce(new Error("Template Access Denied")); // Template fails

        const res = await request(app).post('/add-student').send({
            name: "Fail User",
            matriculationNumber: "240000F",
            courseID: "T63",
            email: "f@tp.edu.sg",
            year: 1
        });

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Template Access Denied");
    });

    // TEST 8: JSON Parsing Failure of Template
    test('POST /add-student - Should return 500 if template file contains invalid JSON', async () => {
        const readFileSpy = jest.spyOn(fs, 'readFile');
        readFileSpy.mockRejectedValueOnce({ code: 'ENOENT' }); // Resource missing
        readFileSpy.mockResolvedValueOnce("invalid-json-content"); // Template corrupt

        const res = await request(app).post('/add-student').send({
            name: "Corrupt User",
            matriculationNumber: "240000C",
            courseID: "T63",
            email: "c@tp.edu.sg",
            year: 1
        });

        expect(res.statusCode).toBe(500);
    });
});