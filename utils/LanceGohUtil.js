const { student } = require('../models/student');
const fs = require('fs').promises;
const path = require('path');
const RESOURCES_FILE = path.join('utils', 'studentDetails.json');
const TEMPLATE_FILE = path.join('utils', 'students.template.json');

async function addStudent(req, res) {
    try {
        const { name, matriculationNumber, courseID, houseAddress, phoneNumber, email, year, className } = req.body;

        // Validation: Check for missing fields 
        if (!name || !matriculationNumber || !email || !courseID || !year) {
            return res.status(400).json({ message: "Validation failed: Missing required fields!" });
        }

        // Branching: Check for valid year 
        if (year < 1 || year > 3) {
            return res.status(400).json({ message: "Validation failed: Year must be between 1 and 3!" });
        }

        const newStudent = new student(name, matriculationNumber, courseID, houseAddress, phoneNumber, email, year, className);
        let resources = [];

        try {
            const data = await fs.readFile(RESOURCES_FILE, 'utf8');
            resources = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8');
                resources = JSON.parse(templateData);
                await fs.writeFile(RESOURCES_FILE, JSON.stringify(resources, null, 2), 'utf8');
            } else {
                throw err;
            }
        }

        // Branching: Check for duplicates to demonstrate high complexity
        const exists = resources.find(s => s.matriculationNumber === matriculationNumber);
        if (exists) {
            return res.status(400).json({ message: "Student with this matriculation number already exists!" });
        }

        resources.push(newStudent);
        await fs.writeFile(RESOURCES_FILE, JSON.stringify(resources, null, 2), 'utf8');
        return res.status(201).json(newStudent);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { addStudent };