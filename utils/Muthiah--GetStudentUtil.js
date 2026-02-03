const fs = require('fs').promises; // it is important to have .promises to ensure that it runs without error due to async and await function
const path = require('path');

const RESOURCES_FILE = path.join('utils', 'studentDetails.json'); //reading the studentDetails.json file
const TEMPLATE_FILE = path.join('utils', 'students.template.json');//reading the student.template.json file
const course_Resource_file = path.join('utils','courses.json');//reading the courses.json file
const course_TEMPLATE_FILE = path.join('utils','courses.template.json');//reading the courses.template.file 

async function getStudent(req, res) {
    try {
        const { matriculationNumber } = req.body; //retrieving the matriculation number passed by the fron end
        if (!matriculationNumber) { //if not matriculation number is provided it will give an error
            return res.status(400).json({ message: "Matriculation Number is required" })
        }
        let student = [];//dynamic student array
        let course = [];//dynamic course array
        try {
            const data = await fs.readFile(RESOURCES_FILE, 'utf8'); //reading the studentDetails.json data file that was retrieved and ensuring that the encoding type is utf8
            const coursedata = await fs.readFile(course_Resource_file, 'utf8');//reading the courses.json data file that was retrieved and ensuring that the encoding type is utf8
            student = JSON.parse(data); //parsing the retrieved data from the studentDetails.json file and storing it in the student dynamic data array
            course = JSON.parse(coursedata); //parsing the retrieved data from the courses.json file and store it in the course data array
        } catch (err) {
            if (err.code === 'ENOENT') {
                // If studentDetails.json doesn't exist, create it from the template
                const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8');
                student = JSON.parse(templateData);
                await fs.writeFile(RESOURCES_FILE, JSON.stringify(student, null, 2), 'utf8');
                // If courses.json doesn't exist, create it from the template
                const coursetemplateData = await fs.readFile(course_TEMPLATE_FILE, 'utf8');
                course = JSON.parse(coursetemplateData);
            } else {
                throw err;
            }
        }
        //retrieving the student data from the dymaic student data array based on the matriculation number provided by the front end
        const studentdetails = student.find(student => student.matriculationNumber === matriculationNumber);
        //retrieving the course details of the current student by matching the course ID retrieved from the student dynamic array to the courseID in the course dynamic data array
        const coursedetails = course.find(course => studentdetails.courseID === course.courseId)
        if (matriculationNumber === -1) { //if no data was returned then this error message will pop up
            return res.status(404).json({ message: "Student not found." })
        } else {
            //if the operation is successfull this message will be returned together with student data and course data related to the student
            return res.status(200).json({
                message: 'Student has been retrieved.', 
                student: studentdetails,
                course: coursedetails
            })
        }
    } catch (err) { //this will be shown if th whole operation failed
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};
module.exports = { getStudent } //exporting the function so that other files can invoke this function 