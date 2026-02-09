// importing the relevant modules
const express = require('express'); // enables front end and back end communication
const bodyParser = require("body-parser"); // it helps express to understand data sent from frontend
const cors = require("cors");
const path = require('path'); // Required for robust path joining
const app = express(); // creates an express application
const PORT = process.env.PORT || 5050;
const logger = require('./logger');

app.use(cors());

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // allows parsing of nested objects in form data
app.use(bodyParser.json()); // extracts data from JSON Payload

// To allow express to access the public folder
// Using path.join ensures compatibility with Jenkins/Windows paths
app.use(express.static(path.join(__dirname, "public")));

const statusMonitor = require('express-status-monitor');

app.use(statusMonitor());

/*istanbul ignore next*/
// ---------- HOME PAGE ----------
const startPage = "index.html";
/*istanbul ignore next*/
app.get('/', (req, res) => {
    // Using path.join prevents "NotFoundError" in different environments like Jenkins
    res.sendFile(path.join(__dirname, "public", startPage));
});

/*istanbul ignore next*/
// --------- Retrieval of data files for TESTING --------
app.get('/students', (req, res) => {
    res.sendFile(path.join(__dirname, "utils", "studentDetails.json"));
});
/*istanbul ignore next*/
app.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, "utils", "courses.json"));
});


// ---------- Importing Student backend files ----------
const { addStudent } = require('./utils/LanceGohUtil.js');
const { getStudent } = require('./utils/Muthiah--GetStudentUtil.js');
const { updatestudent } = require('./utils/MuthiahUtil.js');
const { deleteStudent } = require('./utils/deleteStudentUtil.js');

// ---------- Student CRUD API Routes ----------
app.post('/add-student', addStudent);
app.post('/get-student', getStudent);
app.put('/updatestudent', updatestudent);
app.delete('/delete-student', deleteStudent);


// ---------- Course Routes ----------
const { getCourses } = require("./utils/viewCourseUtil.js");
const { addCourse } = require("./utils/BingHongUtil.js");
const { updateCourse } = require('./utils/updateCourseUtil.js');
const { deleteCourse } = require('./utils/deleteCourseUtil.js');

app.get("/courses", getCourses);
app.post("/add-course", addCourse);
app.put('/update-course', updateCourse);
app.delete('/delete-course', deleteCourse);


// ---------- Server Listener ----------
if (require.main === module) {
    server = app.listen(PORT, function () {
        const address = server.address();
        const port = address ? address.port : PORT;
        const baseUrl = `http://localhost:${port}`;
        console.log(`Project URL: ${baseUrl}`); 
        logger.info(`Demo project at: ${baseUrl}!`);
        logger.error(`Example of error log`);
    });
}

// IMPORTANT: Ensure you export both for your tests (Supertest) to work
module.exports = { app, server };