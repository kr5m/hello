const fs = require('fs').promises; // it is important to have .promises to ensure that it runs without error due to async and await function
const path = require('path');

const RESOURCES_FILE = path.join('utils', 'studentDetails.json');
const TEMPLATE_FILE = path.join('utils', 'students.template.json');

async function deleteStudent(req, res) {
    try {
        const { matriculationNumber } = req.body;
        if (!matriculationNumber) {
            return res.status(400).json({ message: "Matriculation Number is required" })
        }
        let student = [];

        try {
            const data = await fs.readFile(RESOURCES_FILE, 'utf8');
            student = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                // If studentDetails.json doesn't exist, create it from the template
                const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8');
                student = JSON.parse(templateData);
                await fs.writeFile(RESOURCES_FILE, JSON.stringify(student, null, 2), 'utf8');
            } else {
                throw err;
            }
        }

        try {
            const deleteStudent = student.filter(student => student.matriculationNumber !== matriculationNumber)
            await fs.writeFile(
                RESOURCES_FILE,
                JSON.stringify(deleteStudent, null, 2),
                'utf8'
            )
            return res.status(200).json({
                message: "Student has been deleted successfully.",
                deletedMatricNumber: matriculationNumber
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};
module.exports = { deleteStudent }