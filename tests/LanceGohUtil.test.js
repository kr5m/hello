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

    //
    test('POST /add-student - Should return 500 for unexpected server errors', async () => {
        // Force an error by mocking JSON.parse to throw an exception
        jest.spyOn(JSON, 'parse').mockImplementation(() => {
            throw new Error("Simulated Server Error");
        });

        const res = await request(app)
            .post('/add-student')
            .send({
                name: "Error User",             // Required
                matriculationNumber: "2400000E", // Required
                courseID: "T63",                // Required
                email: "error@tp.edu.sg",       // Required
                year: 1,                        // Required (1-3)
                phoneNumber: "87654321",        // Completing the object
                className: "C24BO1",            // Completing the object
                houseAddress: "456 Jurong West" // Completing the object
            });

        // TEST 7: Recovery Failure - Template File Missing or Corrupt
        // This targets the nested 'throw err' inside the ENOENT catch block
        test('POST /add-student - Should return 500 if both resource and template files are missing', async () => {
            // First readFile (Resource) fails with ENOENT
            const readFileSpy = jest.spyOn(fs, 'readFile');
            readFileSpy.mockRejectedValueOnce({ code: 'ENOENT' });

            // Second readFile (Template) fails with a different error (e.g., Permission Denied)
            readFileSpy.mockRejectedValueOnce(new Error("Template Access Denied"));

            const res = await request(app).post('/add-student').send({
                name: "Fail User",
                matriculationNumber: "240000F",
                courseID: "T63",
                email: "f@tp.edu.sg",
                year: 1,
                phoneNumber: "91234567",
                className: "C24BO1"
            });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe("Template Access Denied");
        });

        // TEST 8: JSON Parsing Failure of Template File
        test('POST /add-student - Should return 500 if template file contains invalid JSON', async () => {
            const readFileSpy = jest.spyOn(fs, 'readFile');
            // Resource file is missing
            readFileSpy.mockRejectedValueOnce({ code: 'ENOENT' });
            // Template file is found but contains corrupted data
            readFileSpy.mockResolvedValueOnce("invalid-json-content");

            const res = await request(app).post('/add-student').send({
                name: "Corrupt User",
                matriculationNumber: "240000C",
                courseID: "T63",
                email: "c@tp.edu.sg",
                year: 1,
                phoneNumber: "91234567",
                className: "C24BO1"
            });

            expect(res.statusCode).toBe(500);
        });

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Simulated Server Error");
    });
});